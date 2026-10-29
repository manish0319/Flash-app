TMKI FLASH INSPECTION — GITHUB PAGES UPDATE

Files in this package:
- index.html: updated app interface and print report
- manifest.json: PWA name/theme
- sw.js: service worker cache updated for company logo
- icon-192.png and icon-512.png: app icons
- company-logo.jpg: supplied TMKI company logo
- Code.gs: Google Apps Script backend for filtered rows and Drive photo evidence

GITHUB PAGES UPDATE
1. Download and extract this ZIP.
2. In your existing flash-app GitHub repository, upload/replace the five front-end files: index.html, manifest.json, sw.js, icon-192.png, icon-512.png, and also add company-logo.jpg.
3. Commit the changes.
4. Open the app and press Ctrl+Shift+R, or clear the installed PWA cache/reinstall if an old screen remains.
5. In Apps Script, paste Code.gs only if you intend to update the backend. Save, then Deploy > Manage deployments > Edit > New version > Deploy. Keep the current /exec URL unless you intentionally create a new deployment.
6. Test with one inspection report first. Check Reports, Inspection_Details and the Google Drive photo folder.

Notes:
- The report heading is FLASH INSPECTION REPORT (without DGBB Cage appended).
- Company logo is included in the report; decorative flash illustration is not used in the report header. Actual inspection evidence photos attached by the inspector remain in the report.
- A-Z rows without readings, NG status, remarks or photos are excluded from print/CSV and from Google Sheet detail rows by the supplied Code.gs.
- The report displays the selected inspector's name and Approved By: Manish Vijay. This is a printed name field, not a verified digital signature.
