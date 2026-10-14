import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Media } from '@capacitor-community/media';

(() => {
  if (!Capacitor.isNativePlatform()) return;

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(reader.error || new Error('File read nahi hui'));
    reader.readAsDataURL(file);
  });

  const getOrCreateAlbum = async () => {
    let albums = await Media.getAlbums();
    let album = (albums.albums || []).find(a => a.name === 'Kashtbhanjan Motors');
    if (!album) {
      try { await Media.createAlbum({ name: 'Kashtbhanjan Motors' }); } catch (_) {}
      albums = await Media.getAlbums();
      album = (albums.albums || []).find(a => a.name === 'Kashtbhanjan Motors');
    }
    if (!album || !album.identifier) throw new Error('Gallery album nahi mil paya');
    return album.identifier;
  };

  const savePhoto = async (dataUrl, filename) => {
    if (!dataUrl || !String(dataUrl).startsWith('data:image/')) throw new Error('Image data nahi mili');
    const albumIdentifier = await getOrCreateAlbum();
    await Media.savePhoto({ path: dataUrl, albumIdentifier, fileName: String(filename || 'Invoice').replace(/\.png$/i, '') });
    return true;
  };

  const shareFile = async (file, title) => {
    const base64 = await fileToBase64(file);
    if (!base64) throw new Error('File data khaali hai');
    const safeName = String(file.name || `share-${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const saved = await Filesystem.writeFile({
      path: `shared/${Date.now()}-${safeName}`,
      data: base64,
      directory: Directory.Cache,
      recursive: true
    });
    return Share.share({ title: title || safeName, files: [saved.uri], dialogTitle: 'Invoice / PDF share ya print karein' });
  };

  window.SKMMedia = {
    savePhoto,
    async sharePdf(blob, filename) {
      const file = new File([blob], filename || `Invoice-${Date.now()}.pdf`, { type: 'application/pdf' });
      return shareFile(file, file.name);
    }
  };

  try {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: data => Boolean(data && data.files && data.files.length) });
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: async (data = {}) => {
        if (data.files && data.files.length) return shareFile(data.files[0], data.title || data.files[0].name);
        if (data.url) return AppLauncher.openUrl({ url: data.url });
        throw new Error('Share karne ke liye file ya link nahi mila');
      }
    });
  } catch (e) { console.warn('Native share bridge initialize nahi hua', e); }

  const oldOpen = window.open.bind(window);
  window.open = function (url, target, features) {
    if (typeof url === 'string' && /^https:\/\/wa\.me\//i.test(url)) {
      AppLauncher.openUrl({ url }).catch(() => oldOpen(url, target, features));
      return null;
    }
    return oldOpen(url, target, features);
  };
})();
