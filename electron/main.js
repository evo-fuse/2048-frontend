const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  console.log('Creating browser window');
  console.log('Preload path:', path.join(__dirname, 'preload.js'));
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 960,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false // Try disabling sandbox for testing
    },
  });

  // Load the app
  const appUrl = isDev
    ? 'http://localhost:5173' // Vite dev server URL
    : `file://${path.join(__dirname, '../dist/index.html')}`;
  
  console.log('Loading URL:', appUrl);
  mainWindow.loadURL(appUrl);

  // Open DevTools if in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('Electron app is ready');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('toggle-full-screen', () => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
});

ipcMain.handle('get-full-screen', () => {
  return mainWindow.isFullScreen();
});
