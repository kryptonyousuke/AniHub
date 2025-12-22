"use strict";
const { app, globalShortcut, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
require("os");
const { spawn } = require("child_process");
ipcMain.on("window-action", (event, action) => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window) return;
  switch (action) {
    case "minimize":
      window.minimize();
      break;
    case "maximize":
      if (window.isFullScreen()) {
        window.setFullScreen(false);
        window.unmaximize();
      } else if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
      break;
    case "toggle-fullscreen":
      window.setFullScreen(!window.isFullScreen());
      break;
    case "close":
      window.close();
      break;
  }
});
ipcMain.handle("window-is-maximized", () => {
  const window = BrowserWindow.getFocusedWindow();
  return window ? window.isMaximized() : false;
});
ipcMain.handle("install-plugin", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ extensions: ["js", "py"] }]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, message: "No files selected." };
  }
  const sourcePath = result.filePaths[0];
  const fileName = path.basename(sourcePath);
  const destDir = path.join(app.getPath("userData"), "plugins");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, fileName);
  try {
    fs.copyFileSync(sourcePath, destPath);
    return { success: true, path: destPath };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
function runPlugin(pluginPath, inputData) {
  return new Promise((resolve, reject) => {
    const py = spawn(pluginPath, {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    let error = "";
    py.stdout.on("data", (data) => {
      output += data.toString();
    });
    py.stderr.on("data", (data) => {
      error += data.toString();
    });
    py.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error || `Plugin falhou com código ${code}`));
      }
    });
    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
}
function runSpecificPlugin(pluginName, inputData) {
  return new Promise((resolve, reject) => {
    const py = spawn(path.join(app.getPath("userData"), "plugins", pluginName), {
      stdio: ["pipe", "pipe", "pipe"]
    });
    let output = "";
    let error = "";
    py.stdout.on("data", (data) => {
      output += data.toString();
    });
    py.stderr.on("data", (data) => {
      error += data.toString();
    });
    py.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error || `Plugin falhou com código ${code}`));
      }
    });
    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
}
ipcMain.handle("run-specific-plugin", async (event, pluginName, inputData) => {
  return await runSpecificPlugin(pluginName, inputData);
});
async function runAllPlugins(inputData) {
  const pluginDir = path.join(app.getPath("userData"), "plugins");
  if (!fs.existsSync(pluginDir)) return [];
  const files = fs.readdirSync(pluginDir);
  const results = [];
  for (const file of files) {
    const pluginPath = path.join(pluginDir, file);
    try {
      const result = await runPlugin(pluginPath, inputData);
      results.push({ plugin: file, result });
    } catch (err) {
      results.push({ plugin: file, error: err.message });
    }
  }
  return results;
}
ipcMain.handle("run-plugins", async (event, inputData) => {
  return await runAllPlugins(inputData);
});
function createWindow() {
  const win = new BrowserWindow({
    width: 1e3,
    height: 700,
    minWidth: 1e3,
    minHeight: 300,
    frame: false,
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "build-icon/icons/png/1024x1024.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.maximize();
  win.on("maximize", () => {
    win.webContents.send("window-state-changed", "maximized");
  });
  win.on("unmaximize", () => {
    win.webContents.send("window-state-changed", "restored");
  });
  win.on("enter-full-screen", () => {
    win.webContents.send("window-state-changed", "fullscreen");
  });
  win.on("leave-full-screen", () => {
    win.webContents.send("window-state-changed", "restored");
  });
  if (!app.isPackaged) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "./dist/renderer/index.html"));
    win.webContents.openDevTools();
  }
}
ipcMain.on("toggle-fullscreen", () => {
  if (mainWindow) {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  }
});
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  globalShortcut.register("Ctrl+Shift+I", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) win.webContents.toggleDevTools();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
