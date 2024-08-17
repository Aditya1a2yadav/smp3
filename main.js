const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('update-data', async (event, data) => {
    try {
      fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
      console.log('Data file updated successfully');
    } catch (error) {
      console.error('Error writing data file:', error);
    }
  });

  ipcMain.handle('get-data', async () => {
    try {
      const data = fs.readFileSync('data.json');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      return { students: [], mentors: [] };
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
