const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  save: (data, path, saveAs) => ipcRenderer.invoke('save', data, path, saveAs),
  open: () => ipcRenderer.invoke('open'),
  pdf: () => ipcRenderer.invoke('pdf'),
  pptx: doc => ipcRenderer.invoke('pptx', doc),
  title: t => ipcRenderer.send('title', t)
});
