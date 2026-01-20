"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  windowAction: (action) => ipcRenderer.send("window-action", action),
  onWindowStateChange: (callback) => ipcRenderer.on("window-state-changed", (event, state) => callback(state)),
  installPlugin: () => ipcRenderer.invoke("install-plugin"),
  runPlugins: (data) => ipcRenderer.invoke("run-plugins", data),
  runSpecificPlugin: (pluginName, data) => ipcRenderer.invoke("run-specific-plugin", pluginName, data)
});
