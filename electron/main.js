const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const ethers = require("ethers");
const { encryptData, decryptData } = require("./wallet");
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow() {
  let iconPath;
  if (app.isPackaged) {
    iconPath = path.join(process.resourcesPath, "icon.ico");
  } else {
    iconPath = path.join(__dirname, "icon.ico");
  }

  if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
  }

  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev,
    },
    backgroundColor: "#6B7280",
    show: false,
    icon: iconPath,
    autoHideMenuBar: !isDev,
    frame: true,
  });

  if (!isDev) {
    mainWindow.setMenu(null);
  }

  const startUrl = isDev ? "http://localhost:5173" : "https://app.kingoverroad.org";

  mainWindow.loadURL(startUrl);

  let loadingScreen = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  loadingScreen.loadFile(path.join(__dirname, "loading.html"));
  loadingScreen.center();

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      mainWindow.show();
      if (loadingScreen) {
        loadingScreen.close();
        loadingScreen = null;
      }
    }, 500);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorCode, errorDescription);
      dialog.showErrorBox(
        "Loading Error",
        `Failed to load the application: ${errorDescription}`
      );
    }
  );

  mainWindow.webContents.session.setCertificateVerifyProc(
    (request, callback) => {
      try {
        callback(0);
      } catch (error) {
        console.error("Error in certificate verification:", error);
        callback(-3);
      }
    }
  );

  mainWindow.webContents.openDevTools();
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on("quit", () => {
  app.quit();
});

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("toggle-full-screen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});

ipcMain.handle("get-full-screen", () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
});

ipcMain.handle("exist-wallet", () => {
  try {
    const { homedir } = os.userInfo();
    const walletPath = path.join(homedir, `dwat.json`);
    fs.accessSync(walletPath);
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle("get-private-key", (event, password) => {
  try {
    const { homedir } = os.userInfo();
    const filePath = path.join(homedir, `dwat.json`);
    const encryptedDataStr = fs.readFileSync(filePath, "utf8");
    const encryptedData = JSON.parse(encryptedDataStr);
    const seed = decryptData(encryptedData, password);
    const privateKey = ethers.Wallet.fromPhrase(seed).privateKey;
    return privateKey;
  } catch (error) {
    return null;
  }
});

ipcMain.handle("get-address", () => {
  const { homedir } = os.userInfo();
  const filePath = path.join(homedir, `dwat.json`);

  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);
    const address = jsonData.unencData;
    return address;
  } catch (error) {
    return null;
  }
});

ipcMain.handle("store-seed", (event, encData, unencData, password) => {
  try {
    const { homedir } = os.userInfo();
    const filePath = path.join(homedir, `dwat.json`);
    const encryptedData = encryptData(encData, password);
    const dataToStore = {
      ...encryptedData,
      unencData,
    };
    fs.writeFileSync(filePath, JSON.stringify(dataToStore));
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle("get-seed", (event, password) => {
  try {
    const { homedir } = os.userInfo();
    const filePath = path.join(homedir, `dwat.json`);
    const encryptedDataStr = fs.readFileSync(filePath, "utf8");
    const encryptedData = JSON.parse(encryptedDataStr);

    const decryptedSeed = decryptData(encryptedData, password);
    return decryptedSeed;
  } catch (error) {
    return null;
  }
});
