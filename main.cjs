const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/main/preload.js')
    },
    icon: path.join(__dirname, 'src/renderer/assets/icon.ico'),
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.maximize();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile(path.join(__dirname, 'src/renderer/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  try {
    const module = await import('./src/main/index.js');
    if (module.initialize) {
      module.initialize(mainWindow);
    }
  } catch (error) {
    console.error('Error al cargar el módulo principal:', error);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function createWindow() {
  try {
    const module = await import('./src/main/index.js');
    if (module.createWindow) {
      mainWindow = module.createWindow(BrowserWindow);
    }
  } catch (error) {
    console.error('Error al crear una nueva ventana:', error);
  }
}