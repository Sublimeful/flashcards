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
      title: "Import Cards",
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
