TMKI FLASH INSPECTION — UPDATE V4

Files
- index.html: updated inspection app and print report
- company-logo.jpg: TMKI logo
- icon-192.png / icon-512.png: app icons
- manifest.json / sw.js: PWA metadata and cache version
- Code.gs: Google Apps Script backend for Google Sheets and photo upload

GitHub Pages update
1. Extract this ZIP.
2. Upload all files in this folder to the root of the existing flash-app repository, replacing files with the same names.
3. Commit the changes.
4. Open the app and hard refresh (Ctrl+Shift+R).

Google Apps Script update
1. Open the Apps Script project connected to the spreadsheet.
2. Replace Code.gs with this package's Code.gs and save.
3. Deploy > Manage deployments > Edit > New version > Deploy.
4. The script needs authorization for the spreadsheet and Drive photo folder.

Print notes
- The report title is FLASH INSPECTION REPORT and the app header is hidden during print.
- Chrome can add its own browser header/footer outside the page content. In the print dialog, open More settings and uncheck Headers and footers to remove that browser-generated line.
- No inspector/approval signature section is included.

Before production use, submit a test report and verify Google Sheet rows and Drive photo links. Do not delete existing pending reports until tested.
