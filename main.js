import { app, globalShortcut, BrowserWindow, ipcMain, dialog } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { AnihubDatabase } from "./src/internal/databaseHandler.js";
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/*************************************************
*                                                *
*                 Electron Flags                 *
*                                                *
*************************************************/



app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096 --optimize-for-size');
// app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-accelerated-2d-canvas');
// app.commandLine.appendSwitch('enable-begin-frame-scheduling');
app.commandLine.appendSwitch('enable-zero-copy');
// app.commandLine.appendSwitch('force-gpu-mem-available-mb', '2048');


app.commandLine.appendSwitch("ozone-platform", "wayland");
app.commandLine.appendSwitch("enable-features", "WaylandWindowDecorations");






/*************************************************
*                                                *
*               Plugin Management                *
*                                                *
*************************************************/


/*
* 
*     Install a plugin.
* 
*/


ipcMain.handle("install-plugin", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ extensions: ["js", "py"] }],
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







/*
* 
*     Send a command to a plugin selected by it's name.
* 
*/

function runSpecificPlugin(pluginName, inputData) {
  return new Promise((resolve, reject) => {
    const py = spawn(path.join(app.getPath("userData"), "plugins", pluginName), {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";
    let error = "";
    // get data from stdout
    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    // get failures
    py.stderr.on("data", (data) => {
      error += data.toString();
    });

    // the process end
    py.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error || `Plugin failed with code: ${code}`));
      }
    });

    // send data to stdin (plugin's stdin)
    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
}

ipcMain.handle("run-specific-plugin", async (event, pluginName, inputData) => {
  return await runSpecificPlugin(pluginName, inputData);
})


/*
* 
*     Get the list of all installed plugins.
* 
*/

async function getAllPlugins() {
  const pluginDir = path.join(app.getPath("userData"), "plugins");
  if (!fs.existsSync(pluginDir)) return [];
  const files = fs.readdirSync(pluginDir);
  return files;
}

ipcMain.handle("get-all-plugins", async (event) => {
  return await getAllPlugins();
});


/*
*
*     Delete a plugin by it's name.
* 
*/

async function deletePlugin(pluginName) {
  console.log(pluginName)
  if (pluginName.includes("..")) {
    return { success: false, error: null };
  }
  let filePath = path.join(app.getPath("userData"), "plugins", pluginName);
  console.log(filePath)
  try {
    fs.rm(filePath, () => { });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
ipcMain.handle("delete-plugin", async (event, pluginName) => {
  return await deletePlugin(pluginName);
});






/*************************************************
*                                                *
*     Database Management & stored user data.    *
*                                                *
*************************************************/


const dbPath = path.join(app.getPath("userData"), "anihub_database.db");
const anihubDB = new AnihubDatabase(dbPath);

/* Exposing well-controlled internal database handles */

ipcMain.handle("store-favorite", (event, command_id, name, keyvisual_url, nsfw, type) => anihubDB.storeFavorite(command_id, name, keyvisual_url, nsfw, type));

ipcMain.handle("store-history", (event, command_id, name, keyvisual_url, nsfw, type, timestamp) => anihubDB.storeHistory(command_id, name, keyvisual_url, nsfw, type, timestamp));

ipcMain.handle("get-favorites", (event) => anihubDB.getFavorites());

ipcMain.handle("get-history", (event) => anihubDB.getHistory());

ipcMain.handle("delete-favorite-by-id", (event, id) => anihubDB.deleteFavoriteById(id));

ipcMain.handle("delete-history-by-id", (event, id) => anihubDB.deleteHistoryById(id));








/*************************************************
*                                                *
*               Window Management                *
*                                                *
*************************************************/



/*
* 
*       Makes the window.
* 
*/

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 1000,
    minHeight: 500,
    titleBarStyle: "hidden",
    icon: path.join(__dirname, "build-icon/icons/png/1024x1024.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    show: true
  });
  
  win.maximize()
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
ipcMain.on('toggle-fullscreen', () => {
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



/*
* 
*    Handle with windows events
* 
*/

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
ipcMain.on("close", () => anihubDB.close());