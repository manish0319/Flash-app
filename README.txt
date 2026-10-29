FlashGuard DGBB Cage Inspection – GitHub Pages update

FILES
- index.html: redesigned app; hides blank A-Z rows in printed reports and CSV exports; improves photo marking and report layout.
- manifest.json, sw.js, icon-192.png, icon-512.png: updated PWA metadata, cache version and icon.

GITHUB PAGES
1. Back up your current repository files.
2. Upload/replace these five files in the same folder as the current index.html.
3. Commit changes.
4. Open the app and hard-refresh (Ctrl+Shift+R). If installed as a PWA, close/reopen it after the service worker updates.

GOOGLE SHEETS
Code.gs is supplied separately. Paste it into Apps Script, save, then Deploy > Manage deployments > Edit > New version > Deploy.
The script creates/uses Reports and Inspection_Details tabs and saves photo files to a private-by-default Drive folder. Review your company Drive sharing policy and authorize Drive access when prompted.
The app's CFG.url must point to the active deployed Web App /exec URL. Do not replace it unless you have a new deployment URL.

IMPORTANT
- A-Z rows with no reading, NG status, remark or photo are omitted from print/CSV and Google Sheet detail rows.
- Photos are saved to Google Drive and their links appear in Inspection_Details. Drive file access follows the owner's sharing policy; files are not made public by this code.
- Test with a non-production inspection report first. Keep the old files and pending local reports until the test succeeds.
