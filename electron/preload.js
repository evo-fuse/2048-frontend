const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    ping: () => 'pong',
    openExternal: async (url) => {
      const { shell } = require('electron');
      await shell.openExternal(url);
    },
    closeApp: () => ipcRenderer.send('close-app'),
    toggleFullScreen: () => ipcRenderer.send('toggle-full-screen'),
    getFullScreen: () => ipcRenderer.invoke('get-full-screen'),
    onEnterFullScreen: (callback) => {
      ipcRenderer.on('enter-full-screen', () => callback());
    },
    onLeaveFullScreen: (callback) => {
      ipcRenderer.on('leave-full-screen', () => callback());
    },
    removeFullScreenListeners: () => {
      ipcRenderer.removeAllListeners('enter-full-screen');
      ipcRenderer.removeAllListeners('leave-full-screen');
    }
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