const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (options) => ipcRenderer.send('show-notification', options),
  onNavigateTab: (callback) => ipcRenderer.on('navigate-tab', (event, tab) => callback(tab)),
  onToggleWidget: (callback) => ipcRenderer.on('toggle-widget', () => callback()),
});
