const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const fs = require('fs'), path = require('path');
const { buildPptx } = require('./pptx');
let win;
const FILTER = [{ name: 'Slidex presentation', extensions: ['slidex'] }];
function create() {
  win = new BrowserWindow({ width: 1400, height: 880, minWidth: 900, minHeight: 600, backgroundColor: '#d9dce1', title: 'Slidex',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
}
ipcMain.handle('save', async (_, data, file, saveAs) => {
  if (!file || saveAs) { const r = await dialog.showSaveDialog(win, { defaultPath: 'Presentation.slidex', filters: FILTER }); if (r.canceled) return null; file = r.filePath; }
  fs.writeFileSync(file, data, 'utf8'); return file;
});
ipcMain.handle('open', async () => {
  const r = await dialog.showOpenDialog(win, { filters: FILTER, properties: ['openFile'] }); if (r.canceled) return null;
  return { file: r.filePaths[0], data: fs.readFileSync(r.filePaths[0], 'utf8') };
});
ipcMain.handle('pdf', async () => {
  const r = await dialog.showSaveDialog(win, { defaultPath: 'Presentation.pdf', filters: [{ name: 'PDF', extensions: ['pdf'] }] }); if (r.canceled) return null;
  const buf = await win.webContents.printToPDF({ printBackground: true, preferCSSPageSize: true });
  fs.writeFileSync(r.filePath, buf); return r.filePath;
});
ipcMain.handle('pptx', async (_, doc) => {
  const r = await dialog.showSaveDialog(win, { defaultPath: 'Presentation.pptx', filters: [{ name: 'PowerPoint', extensions: ['pptx'] }] }); if (r.canceled) return null;
  await buildPptx(doc).writeFile({ fileName: r.filePath }); return r.filePath;
});
ipcMain.on('title', (_, t) => win && win.setTitle(t));
app.whenReady().then(() => {
  const mac = process.platform === 'darwin';
  Menu.setApplicationMenu(Menu.buildFromTemplate([...(mac ? [{ role: 'appMenu' }] : []), { label: 'File', submenu: [{ role: 'quit' }] }, { role: 'editMenu' }, { label: 'View', submenu: [{ role: 'togglefullscreen' }] }]));
  create();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && create());
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
