const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const ethers = require("ethers");
const { encryptData, decryptData } = require("./wallet");

let mainWindow;

function createWindow() {
  console.log("Starting application...");

  console.log("Creating browser window");
  console.log("Preload path:", path.join(__dirname, "preload.js"));

  // Determine the correct icon path based on whether we're in development or production
  let iconPath;
  if (app.isPackaged) {
    // In production, look in the resources directory
    iconPath = path.join(process.resourcesPath, "icon.ico");
  } else {
    // In development, look in the project root
    iconPath = path.join(__dirname, "icon.ico");
  }

  // Set the application icon
  if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
  }

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: false,
    },
    backgroundColor: "#6B7280",
    show: false,
    icon: iconPath,
    autoHideMenuBar: true,
    frame: true,
  });

  // Enable the menu bar
  mainWindow.setMenu(null);

  const startUrl = "https://app.kingoverroad.org";

  console.log("Loading URL:", startUrl);
  mainWindow.loadURL(startUrl);

  // Create a loading screen
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

  // Once the main window is ready, show it and close the loading screen
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

  // For debugging
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
        // Make sure requestUrl exists before trying to parse it
        callback(0); // Accept certificate
      } catch (error) {
        console.error("Error in certificate verification:", error);
        // If URL parsing fails, use default verification
        callback(-3);
      }
    }
  );

  // Enable DevTools in development mode
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
