# Shree Kashtbhanjan Motors APK project

This project keeps the existing invoice/quotation app and adds Android-specific handling for:
- saving invoice/quotation photos to the phone's photo gallery on Android;
- generating a PDF for invoice/quotation and opening Android's share sheet so the user can choose Print or Save;
- keeping normal browser behavior for Chrome/web.

## Build
1. `npm install`
2. `npm run build`
3. `npx cap add android` (first build only)
4. `npx cap sync android`
5. `cd android && ./gradlew assembleDebug`

The GitHub Actions workflow builds a debug APK and uploads it as an artifact.

## Notes
The Android PDF button opens the Android share sheet with the generated PDF; choose a print service or a save destination there. The photo button writes the image into a `Kashtbhanjan Motors` album in the phone's photo library. Test on the target phone after installing the APK. Existing customer records, calculations, reports, WhatsApp behavior and other app features are intentionally left unchanged.
