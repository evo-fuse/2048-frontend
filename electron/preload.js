const { contextBridge, ipcRenderer } = require('electron');

// Simple test API
contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  openExternal: (url) => {
    const { shell } = require('electron');
    return shell.openExternal(url);
  },
  closeApp: () => ipcRenderer.send('close-app'),
  toggleFullScreen: () => ipcRenderer.send('toggle-full-screen'),
  getFullScreen: () => ipcRenderer.invoke('get-full-screen'),
  onEnterFullScreen: (callback) => {
    ipcRenderer.on('enter-full-screen', () => callback(true));
  },
  onLeaveFullScreen: (callback) => {
    ipcRenderer.on('leave-full-screen', () => callback(false));
  },
  removeFullScreenListeners: () => {
    ipcRenderer.removeAllListeners('enter-full-screen');
    ipcRenderer.removeAllListeners('leave-full-screen');
  }
});

console.log('Preload script executed, electronAPI exposed');

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded in preload script');
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
}) 