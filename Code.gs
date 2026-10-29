const SECRET_KEY = "TMKI";
const SPREADSHEET_ID = "1CkBS2Tgzp9WmFm8xJXwRfEaWf0mj71YlVNRIYaetLb0";
const PHOTO_FOLDER_NAME = "FlashGuard Inspection Photos";

const REPORT_HEADERS = [
  "Report ID", "Date/Time", "Shift", "Part Name", "Lot No",
  "Cavity No", "Inspector", "Comments", "NG Item Count",
  "Overall Result", "Received At"
];

const DETAIL_HEADERS = [
  "Report ID", "Date/Time", "Lot No", "Inspector", "Item No",
  "Inspection Item", "Overall Result", "Location", "Reading (mm)",
  "Location Result", "Remark", "Photo URL"
];

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const reports = getSheet(ss, "Reports", REPORT_HEADERS);
    const details = getSheet(ss, "Inspection_Details", DETAIL_HEADERS);
    return jsonResponse({
      ok: true,
      message: "FlashGuard API is running",
      spreadsheet: ss.getName(),
      reportsSheet: reports.getName(),
      detailsSheet: details.getName()
    });
  } catch (err) {
    return jsonResponse({ok:false, error:String(err.message || err)});
  }
}

function doPost(e) {
  let lock;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No request data received");
    }
    const body = JSON.parse(e.postData.contents);
    if (body.key !== SECRET_KEY) throw new Error("Invalid key");

    const rec = body.rec;
    if (!rec || !rec.uid || !Array.isArray(rec.items)) {
      throw new Error("Invalid report data");
    }

    lock = LockService.getScriptLock();
    lock.waitLock(20000);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const reports = getSheet(ss, "Reports", REPORT_HEADERS);
    const details = getSheet(ss, "Inspection_Details", DETAIL_HEADERS);

    const last = reports.getLastRow();
    if (last > 1) {
      const ids = reports.getRange(2, 1, last - 1, 1)
        .getDisplayValues().flat();
      if (ids.includes(String(rec.uid))) {
        return jsonResponse({ok:true, duplicate:true, id:String(rec.uid)});
      }
    }

    const overall = Number(rec.ng || 0) > 0 ? "NOT OK" : "OK";
    const detailRows = [];

    rec.items.forEach((item, index) => {
      const entries = Array.isArray(item.e) ? item.e : [];
      const locationBased = Boolean(item.loc);

      // For A-Z rows, upload only entered readings or rows with NG/evidence.
      const selected = locationBased
        ? entries.filter(entry =>
            String(entry.v ?? "").trim() !== "" ||
            entry.ng ||
            String(entry.n || "").trim() !== "" ||
            Boolean(entry.img))
        : entries;

      selected.forEach(entry => {
        const photoUrl = entry.img
          ? savePhoto(entry.img, rec, item, entry.loc || "General")
          : "";

        detailRows.push([
          String(rec.uid), rec.t || "", rec.lot || "", rec.insp || "",
          index + 1, item.k || "",
          item.r === "ng" ? "NOT OK" : "OK",
          entry.loc || "", entry.v === "" ? "" : entry.v,
          entry.ng ? "NG" : "OK", entry.n || "", photoUrl
        ]);
      });

      // Store non-location checks even if no measurement value is required.
      if (!locationBased && selected.length === 0) {
        detailRows.push([
          String(rec.uid), rec.t || "", rec.lot || "", rec.insp || "",
          index + 1, item.k || "",
          item.r === "ng" ? "NOT OK" : "OK",
          "", "", "", "", ""
        ]);
      }

      // Store any additional photos attached to the inspection item.
      (Array.isArray(item.p) ? item.p : []).forEach(photo => {
        if (!photo.img) return;
        const photoUrl = savePhoto(
          photo.img, rec, item, photo.loc || "Photo evidence"
        );
        detailRows.push([
          String(rec.uid), rec.t || "", rec.lot || "", rec.insp || "",
          index + 1, item.k || "", "PHOTO EVIDENCE",
          photo.loc || "", "", "", photo.n || "", photoUrl
        ]);
      });
    });

    // Write details first, then summary. If a failure occurs, a retry is safe
    // for the summary ID, though a partial detail write should be checked.
    if (detailRows.length) {
      details.getRange(
        details.getLastRow() + 1, 1, detailRows.length, DETAIL_HEADERS.length
      ).setValues(detailRows);
    }

    reports.appendRow([
      String(rec.uid), rec.t || "", rec.shift || "", rec.part || "",
      rec.lot || "", rec.cav || "", rec.insp || "", rec.cm || "",
      Number(rec.ng || 0), overall, new Date()
    ]);
    SpreadsheetApp.flush();

    return jsonResponse({
      ok:true, id:String(rec.uid),
      message:"Report and filtered inspection details uploaded"
    });
  } catch (err) {
    return jsonResponse({ok:false, error:String(err.message || err)});
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function savePhoto(dataUrl, rec, item, location) {
  const match = String(dataUrl).match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return "";
  const mimeType = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  const extension = mimeType.indexOf("png") >= 0 ? "png" : "jpg";
  const safe = value => String(value || "").replace(/[^\w.-]+/g, "_").slice(0, 60);
  const fileName = [
    "FlashGuard", safe(rec.lot), safe(rec.cav),
    safe(item.k), safe(location), safe(rec.uid)
  ].join("_") + "." + extension;

  const blob = Utilities.newBlob(bytes, mimeType, fileName);
  const folder = getPhotoFolder();
  const file = folder.createFile(blob);
  // Do not make photos public. Access follows the Drive owner's sharing policy.
  return file.getUrl();
}

function getPhotoFolder() {
  const folders = DriveApp.getFoldersByName(PHOTO_FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(PHOTO_FOLDER_NAME);
}

function getSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const existingHeaders = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0]
    : [];
  const needsHeaders = sheet.getLastRow() === 0 ||
    headers.some((header, i) => existingHeaders[i] !== header);

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold").setBackground("#1748c9").setFontColor("#ffffff");
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
