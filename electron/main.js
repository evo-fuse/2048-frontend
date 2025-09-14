import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import os from "os";
import { ethers } from "ethers";
import isDev from "electron-is-dev";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const encryptData = (data, password) => {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  let encryptedSeed = cipher.update(JSON.stringify(data), "utf8", "hex");
  encryptedSeed += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return {
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
    encryptedSeed,
    authTag: authTag.toString("hex"),
  };
};

const decryptData = (encryptedData, password) => {
  const salt = Buffer.from(encryptedData.salt, "hex");
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  const iv = Buffer.from(encryptedData.iv, "hex");
  const authTag = Buffer.from(encryptedData.authTag, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);

  let decryptedSeed = decipher.update(
    encryptedData.encryptedSeed,
    "hex",
    "utf8"
  );
  decryptedSeed += decipher.final("utf8");

  return JSON.parse(decryptedSeed);
};

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
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev,
    },
    backgroundColor: "#6B7280",
    show: false,
    icon: iconPath,
    autoHideMenuBar: true,
    frame: true,
  });

  if (!isDev) {
    mainWindow.setMenu(null);
  }

  const startUrl = "https://2048.evofuse.xyz";

  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
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

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.on("ready", createWindow);

const handleWindowAllClosed = () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
};

app.on("window-all-closed", handleWindowAllClosed);

const handleActivate = () => {
  if (mainWindow === null) {
    createWindow();
  }
};

app.on("activate", handleActivate);

const handleQuit = () => {
  app.quit();
};

app.on("quit", handleQuit);

ipcMain.on("close-app", handleQuit);

const handleToggleFullScreen = () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
};

ipcMain.on("toggle-full-screen", handleToggleFullScreen);

const handleGetFullScreen = () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
};

ipcMain.handle("get-full-screen", handleGetFullScreen);

const handleExistWallet = () => {
  try {
    const { homedir } = os.userInfo();
    const walletPath = path.join(homedir, `dwat.json`);
    fs.accessSync(walletPath);
    return true;
  } catch (error) {
    return false;
  }
};

ipcMain.handle("exist-wallet", handleExistWallet);

const handleGetPrivateKey = (event, password) => {
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
};

ipcMain.handle("get-private-key", handleGetPrivateKey);

const handleGetAddress = () => {
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
};

ipcMain.handle("get-address", handleGetAddress);

const handleStoreSeed = (event, encData, unencData, password) => {
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
};

ipcMain.handle("store-seed", handleStoreSeed);

const handleGetSeed = (event, password) => {
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
};

ipcMain.handle("get-seed", handleGetSeed);
