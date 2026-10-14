import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

(() => {
  if (!Capacitor.isNativePlatform()) return;

  const nativeShareFile = async (file, title) => {
    if (!(file instanceof Blob)) throw new Error('Share ke liye file nahi mili');
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
      reader.onerror = () => reject(reader.error || new Error('File read nahi hui'));
      reader.readAsDataURL(file);
    });
    if (!dataUrl) throw new Error('Image data khaali hai');
    const safeName = String(file.name || `share-${Date.now()}.png`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const saved = await Filesystem.writeFile({
      path: `shared/${Date.now()}-${safeName}`,
      data: dataUrl,
      directory: Directory.Cache,
      recursive: true
    });
    return Share.share({
      title: title || safeName,
      files: [saved.uri],
      dialogTitle: 'Invoice / Quotation share karein'
    });
  };

  // Existing Chrome sharing code remains unchanged. In the APK, route file sharing
  // through Capacitor so Android receives a real file URI instead of a browser Blob.
  try {
    Object.defineProperty(navigator, 'canShare', {
      configurable: true,
      value: (data) => Boolean(data && Array.isArray(data.files) && data.files.length)
    });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data = {}) => {
        if (data.files && data.files.length) {
          return nativeShareFile(data.files[0], data.title || data.files[0].name);
        }
        if (data.url) return AppLauncher.openUrl({ url: data.url });
        throw new Error('Share karne ke liye file ya link nahi mila');
      }
    });
  } catch (e) {
    console.warn('Native share bridge initialize nahi hua', e);
  }

  // Open WhatsApp links through Android's app/link resolver instead of a new WebView window.
  const oldOpen = window.open.bind(window);
  window.open = function (url, target, features) {
    if (typeof url === 'string' && /^https:\/\/wa\.me\//i.test(url)) {
      AppLauncher.openUrl({ url }).catch(() => oldOpen(url, target, features));
      return null;
    }
    return oldOpen(url, target, features);
  };
})();
