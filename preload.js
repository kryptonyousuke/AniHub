const { contextBridge, ipcRenderer } = require("electron");

/*
*
*       Exposes the handles into window.electronAPI.* 
* 
*/
contextBridge.exposeInMainWorld("electronAPI", {
  /* Window handles */
  windowAction: (action) => ipcRenderer.send("window-action", action),
  onWindowStateChange: (callback) => ipcRenderer.on("window-state-changed", (event, state) => callback(state)),
  
  /* Plugins handles */
  installPlugin: () => ipcRenderer.invoke("install-plugin"),
  getAllPlugins: () => ipcRenderer.invoke("get-all-plugins"),
  runPlugins: (data) => ipcRenderer.invoke("run-plugins", data),
  runSpecificPlugin: (pluginName, data) => ipcRenderer.invoke("run-specific-plugin", pluginName, data),
  deletePlugin: (pluginName) => ipcRenderer.invoke("delete-plugin", pluginName),
  
  /* Database handles */
  storeFavorite: (command_id, name, keyvisual_url, nsfw, type) => ipcRenderer.invoke("store-favorite", command_id, name, keyvisual_url, nsfw, type),
  storeHistory: (command_id, name, keyvisual_url, nsfw, type, timestamp) => ipcRenderer.invoke("store-history", command_id, name, keyvisual_url, nsfw, type, timestamp),
  getFavorites: () => ipcRenderer.invoke("get-favorites"),
  getHistory: () => ipcRenderer.invoke("get-history"),
  deleteFavoriteById: (id) => ipcRenderer.invoke("delete-favorite-by-id", id),
  deleteHistoryById: (id) => ipcRenderer.invoke("delete-history-by-id", id)
});
