const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');

let mainWindow;

function createWindow() {
  console.log('Creating browser window');
  console.log('Preload path:', path.join(__dirname, 'preload.js'));
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    // Show loading screen immediately
    backgroundColor: '#2e2c29', // Dark background color
    show: false // Don't show until ready
  });

  const startUrl = "http://95.216.251.178:5174" || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);
  
  // Create a loading screen
  let loadingScreen = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  loadingScreen.loadFile(path.join(__dirname, 'loading.html'));
  loadingScreen.center();
  
  // Once the main window is ready, show it and close the loading screen
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      mainWindow.show();
      if (loadingScreen) {
        loadingScreen.close();
        loadingScreen = null;
      }
    }, 500); // Small delay to ensure everything is rendered
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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
