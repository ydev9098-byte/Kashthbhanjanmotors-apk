# Shree Kashtbhanjan Motors — Android APK

This project packages the existing invoice/quotation HTML app using Capacitor. It keeps the original app UI and local data logic, bundles `html2canvas` for offline invoice/quotation image creation, and adds an Android-native share bridge for image files and WhatsApp links.

## Build using GitHub Actions

1. Upload the complete contents of this project to a GitHub repository (keep the folder structure).
2. Open **Actions** → **Build Shree Kashtbhanjan Motors APK**.
3. Press **Run workflow** (or push a commit to `main` / `master`).
4. When the run finishes, open it and download the **Shree-Kashtbhanjan-Motors-APK** artifact.
5. Extract the downloaded artifact ZIP; install `app-debug.apk` on the Android phone.

## Notes

- The APK uses Capacitor's Android WebView with native bridges for file sharing and external WhatsApp links; a WebView alone does not provide all native sharing behavior.
- The invoice/quotation image action opens Android's share sheet. Choose WhatsApp there, then choose the recipient. Android does not allow a generic share sheet to silently send an image to a customer without the user's confirmation.
- Customer records and quotations are still stored using the original app's browser storage behavior. Keep regular JSON backups. Uninstalling or clearing app data can erase locally stored records.
- This is a debug APK for personal installation, not a signed Play Store release.
