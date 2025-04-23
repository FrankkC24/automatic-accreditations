const { contextBridge, ipcRenderer } = require('electron');

// Exposing safe APIs to the renderer process
contextBridge.exposeInMainWorld('api', {
  // File generation
  generateTxt: (data) => ipcRenderer.invoke('generate-txt', data),
  generateExcel: (data) => ipcRenderer.invoke('generate-excel', data),
 
  // File import
  importExcel: () => ipcRenderer.invoke('import-excel'),
  importPersonnelList: () => ipcRenderer.invoke('import-personnel-list')
});