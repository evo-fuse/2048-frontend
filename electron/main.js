const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const kill = require("tree-kill");
const { execFile } = require("child_process");
const fs = require("fs");

let node;
let mainWindow;

function runNode() {
  return new Promise((resolve, reject) => {
    // Determine the correct path for local.exe based on whether we're in development or production
    let exePath;

    if (app.isPackaged) {
      // In production, look in the resources directory
      exePath = path.join(process.resourcesPath, "local.exe");
    } else {
      // In development, look in the project root
      exePath = path.join(__dirname, "..", "local.exe");
    }

    // Check if the file exists
    if (!fs.existsSync(exePath)) {
      console.error(`Error: local.exe not found at ${exePath}`);
      dialog.showErrorBox(
        "Application Error",
        `Required file local.exe not found at ${exePath}`
      );
      reject(new Error(`local.exe not found at ${exePath}`));
      return;
    }

    console.log(`Starting local.exe from: ${exePath}`);

    // node = execFile(
    //   exePath,
    //   [],
    //   {
    //     windowsHide: true,
    //     shell: true,
    //   },
    //   (error, stdout, stderr) => {
    //     if (error) {
    //       console.error("Error running local.exe:", error);
    //       reject(error);
    //     }
    //     if (stdout) console.log("local.exe stdout:", stdout);
    //     if (stderr) console.error("local.exe stderr:", stderr);
    //   }
    // );

    setTimeout(function () {
      resolve();
    }, 1000);
  });
}

function killNode() {
  if (node && node.pid) {
    try {
      kill(node.pid);
    } catch (err) {
      console.error("Error killing node process:", err);
    }
  }
}

function createWindow() {
  console.log("Starting application...");

  runNode()
    .then(() => {
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
      if (process.platform === 'win32') {
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
          devTools: false
        },
        backgroundColor: "#6B7280",
        show: false,
        icon: iconPath,
        autoHideMenuBar: true,
        frame: true
      });

      // To completely remove the menu bar (add after creating mainWindow)
      mainWindow.setMenu(null);

      const startUrl = "http://localhost:5173";

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

      // Prevent keyboard shortcuts for opening DevTools
      mainWindow.webContents.on('before-input-event', (event, input) => {
        // Block F12 and Ctrl+Shift+I
        if ((input.key === 'F12') || 
            (input.control && input.shift && input.key.toLowerCase() === 'i')) {
          event.preventDefault();
        }
      });
    })
    .catch((err) => {
      console.error("Failed to start application:", err);
      dialog.showErrorBox(
        "Application Error",
        `Failed to start the application: ${err.message}`
      );
      app.quit();
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  killNode();
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
  killNode();
});

ipcMain.on("close-app", () => {
  killNode();
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
