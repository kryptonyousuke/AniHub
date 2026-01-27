const { app, globalShortcut, BrowserWindow, ipcMain, dialog } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Electron flags 
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096 --optimize-for-size');
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('enable-gpu-rasterization');
// app.commandLine.appendSwitch('enable-begin-frame-scheduling');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('force-gpu-mem-available-mb', '2048');

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
* Run a plugin by it's absolute path.
* 
*/

function runPlugin(pluginPath, inputData) {
  return new Promise((resolve, reject) => {
    const py = spawn(pluginPath, {
      stdio: ["pipe", "pipe", "pipe"]
    });

    let output = "";
    let error = "";

    // get output
    py.stdout.on("data", (data) => {
      output += data.toString();
    });

    // get errors
    py.stderr.on("data", (data) => {
      error += data.toString();
    });

    // process end
    py.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(error || `Plugin falhou com código ${code}`));
      }
    });

    // send data via stdin
    py.stdin.write(JSON.stringify(inputData));
    py.stdin.end();
  });
}




/*
* 
* Send a command to a plugin selected by it's name.
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
*  Send a single command to all plugins.
* 
*/
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
