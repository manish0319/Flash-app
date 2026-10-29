TMKI FLASH INSPECTION — UPDATED UI PACKAGE

Files:
- index.html: updated light professional inspection UI and print report
- manifest.json: updated app theme and title
- sw.js: updated service-worker cache version
- icon-192.png / icon-512.png: app icons
- company-logo.jpg: supplied TMKI logo
- Code.gs: Google Apps Script backend included for the existing Google Sheet integration

Deploy to GitHub Pages:
1. Extract this ZIP.
2. Upload/replace index.html, manifest.json, sw.js, icon-192.png, icon-512.png, company-logo.jpg in the existing repository.
3. Commit changes.
4. Refresh the website with Ctrl+Shift+R. If installed as a PWA, close/reopen it after refreshing.
5. Backend code has not been changed for this visual update; only redeploy Code.gs if you separately update it.

UI changes:
- Header shows the TMKI logo without company-name text.
- Print report heading is FLASH INSPECTION REPORT.
- Signature blocks are labels and blank signature areas only; no printed personal names under the signatures.
- Explicit light theme prevents dark-mode contrast problems.
- Remarks are placed alongside the photo control for inspection rows.
