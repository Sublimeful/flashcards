const { app, BrowserWindow } = require('electron')
const { ipcMain, dialog } = require("electron");
const path = require("path")

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile(path.join(__dirname, "..", "src", "index.html"))

  ipcMain.handle("import_flashcards", (e, default_path) => {
    dialog.showOpenDialog({
      title: "Import Flashcards",
      defaultPath: default_path,
      properties: ['openFile'],
      filters: [{
        name: 'Flashcards file',
        extensions: ['cards']
      }]
    }).then(res => {
      win.webContents.send("import_flashcards", res);
    })
  })

  ipcMain.handle("export_flashcards", (e, default_path) => {
    dialog.showSaveDialog({title: "Export Flashcards", defaultPath: default_path, filters: [{ name: 'Flashcards Files', extensions: ['cards'] }]})
      .then(res => {
        win.webContents.send("export_flashcards", res);
      })
  })

  ipcMain.handle("get_appdata", async e => {
    return app.getPath("appData")
  })

  ipcMain.handle("notify", (e, title, message) => {
    dialog.showErrorBox(title, message);
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

try {
  require('electron-reloader')(module);
} catch {}
