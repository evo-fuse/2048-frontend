import { contextBridge, ipcRenderer, shell } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ping: () => {
      console.log("Ping called");
      return 'pong';
    },
    openExternal: async (url) => {
      console.log("Opening external URL:", url);
      await shell.openExternal(url);
    },
    closeApp: () => {
      console.log("Close app called");
      ipcRenderer.send('close-app');
    },
    toggleFullScreen: () => {
      console.log("Toggle fullscreen called");
      ipcRenderer.send('toggle-full-screen');
    },
    getFullScreen: () => {
      console.log("Get fullscreen called");
      return ipcRenderer.invoke('get-full-screen');
    },
    onEnterFullScreen: (callback) => {
      console.log("Setting enter fullscreen listener");
      ipcRenderer.on('enter-full-screen', () => callback());
    },
    onLeaveFullScreen: (callback) => {
      console.log("Setting leave fullscreen listener");
      ipcRenderer.on('leave-full-screen', () => callback());
    },
    removeFullScreenListeners: () => {
      console.log("Removing fullscreen listeners");
      ipcRenderer.removeAllListeners('enter-full-screen');
      ipcRenderer.removeAllListeners('leave-full-screen');
    },
    storeSeed: (encData, unencData, password) => {
      console.log("Store seed called");
      return ipcRenderer.invoke('store-seed', encData, unencData, password);
    },
    getSeed: (password) => {
      console.log("Get seed called");
      return ipcRenderer.invoke('get-seed', password);
    },
    getPrivateKey: (password) => {
      console.log("Get private key called");
      return ipcRenderer.invoke('get-private-key', password);
    },
    getAddress: () => {
      console.log("Get address called");
      return ipcRenderer.invoke('get-address');
    },
    existWallet: () => {
      console.log("Exist wallet called");
      return ipcRenderer.invoke('exist-wallet');
    },
  }
);

console.log('Preload script executed, electronAPI exposed');

window.addEventListener('DOMContentLoaded', () => {
  // This ensures all resources are loaded before showing the main window
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
}) 