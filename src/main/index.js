// import { app, BrowserWindow, ipcMain, dialog } from 'electron';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs/promises';
// import * as excelReader from '../services/fileReaders/excelReader.js';
// import * as txtGenerator from '../services/fileGenerators/txtGenerator.js';
// import * as excelGenerator from '../services/fileGenerators/excelGenerator.js';

// // Get __dirname equivalent in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Global reference to prevent garbage collection
// let mainWindow;

// const createWindow = () => {
//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 900,
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js')
//     },
//     icon: path.join(__dirname, '../renderer/assets/icon.ico'),
//     autoHideMenuBar: true,
//     show: false
//   });

//   mainWindow.maximize();

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

//   if (process.env.NODE_ENV === 'development') {
//     mainWindow.webContents.openDevTools();
//   }
// };

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

// // IPC handlers
// ipcMain.handle('generate-txt', async (_, { header, operations, fileType }) => {
//   try {
//     const { filePath, canceled } = await dialog.showSaveDialog({
//       title: 'Guardar archivo TXT',
//       defaultPath: `PHNROCF${header.accreditationDate || new Date().toISOString().slice(0,10).replace(/-/g,'')}001.txt`,
//       filters: [{ name: 'Text Files', extensions: ['txt'] }]
//     });

//     if (canceled || !filePath) return { success: false, message: 'Operación cancelada por el usuario' };

//     const content = txtGenerator.generateTxtFile(header, operations, fileType);
//     await fs.writeFile(filePath, content);
    
//     return { success: true, filePath };
//   } catch (error) {
//     console.error('Error generando el TXT:', error);
//     return { success: false, message: error.message };
//   }
// });

// ipcMain.handle('generate-excel', async (_, { header, operations, fileType }) => {
//   try {
//     const { filePath, canceled } = await dialog.showSaveDialog({
//       title: 'Guardar archivo Excel',
//       defaultPath: 'acreditaciones_automaticas.xlsx',
//       filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
//     });

//     if (canceled || !filePath) return { success: false, message: 'Operación cancelada por el usuario' };

//     await excelGenerator.generateExcelFile(header, operations, fileType, filePath);
    
//     return { success: true, filePath };
//   } catch (error) {
//     console.error('Error generando Excel:', error);
//     return { success: false, message: error.message };
//   }
// });

// ipcMain.handle('import-excel', async () => {
//   try {
//     const { filePaths, canceled } = await dialog.showOpenDialog({
//       title: 'Importar archivo Excel',
//       filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
//       properties: ['openFile']
//     });

//     if (canceled || !filePaths || filePaths.length === 0) {
//       return { success: false, message: 'No se ha seleccionado ningún archivo' };
//     }

//     const excelData = await excelReader.readExcelFile(filePaths[0]);
//     return { success: true, data: excelData };
//   } catch (error) {
//     console.error('Error al importar el Excel: ', error);
//     return { success: false, message: error.message };
//   }
// });

// ipcMain.handle('import-personnel-list', async () => {
//   try {
//     const { filePaths, canceled } = await dialog.showOpenDialog({
//       title: 'Importar Lista de Personal',
//       filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
//       properties: ['openFile']
//     });

//     if (canceled || !filePaths || filePaths.length === 0) {
//       return { success: false, message: 'No se ha seleccionado ningún archivo' };
//     }

//     const personnel = await excelReader.readPersonnelList(filePaths[0]);
//     return { success: true, personnel };
//   } catch (error) {
//     console.error('Error al importar la lista de docentes: ', error);
//     return { success: false, message: error.message };
//   }
// });

import { ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import * as excelReader from '../services/fileReaders/excelReader.js';
import * as txtGenerator from '../services/fileGenerators/txtGenerator.js';
import * as excelGenerator from '../services/fileGenerators/excelGenerator.js';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export initialize function to be called from main.cjs
export function initialize(mainWindow) {
  // IPC handlers
  ipcMain.handle('generate-txt', async (_, { header, operations, fileType }) => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Guardar archivo TXT',
        defaultPath: `PHNROCF${header.accreditationDate || new Date().toISOString().slice(0,10).replace(/-/g,'')}001.txt`,
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
      });

      if (canceled || !filePath) return { success: false, message: 'Operación cancelada por el usuario' };

      const content = txtGenerator.generateTxtFile(header, operations, fileType);
      await fs.writeFile(filePath, content);
      
      return { success: true, filePath };
    } catch (error) {
      console.error('Error generando el TXT:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('generate-excel', async (_, { header, operations, fileType }) => {
    try {
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Guardar archivo Excel',
        defaultPath: 'acreditaciones_automaticas.xlsx',
        filters: [{ name: 'Excel Files', extensions: ['xlsx'] }]
      });

      if (canceled || !filePath) return { success: false, message: 'Operación cancelada por el usuario' };

      await excelGenerator.generateExcelFile(header, operations, fileType, filePath);
      
      return { success: true, filePath };
    } catch (error) {
      console.error('Error generando Excel:', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('import-excel', async () => {
    try {
      const { filePaths, canceled } = await dialog.showOpenDialog({
        title: 'Importar archivo Excel',
        filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
        properties: ['openFile']
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return { success: false, message: 'No se ha seleccionado ningún archivo' };
      }

      const excelData = await excelReader.readExcelFile(filePaths[0]);
      return { success: true, data: excelData };
    } catch (error) {
      console.error('Error al importar el Excel: ', error);
      return { success: false, message: error.message };
    }
  });

  ipcMain.handle('import-personnel-list', async () => {
    try {
      const { filePaths, canceled } = await dialog.showOpenDialog({
        title: 'Importar Lista de Personal',
        filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }],
        properties: ['openFile']
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return { success: false, message: 'No se ha seleccionado ningún archivo' };
      }

      const personnel = await excelReader.readPersonnelList(filePaths[0]);
      return { success: true, personnel };
    } catch (error) {
      console.error('Error al importar la lista de docentes: ', error);
      return { success: false, message: error.message };
    }
  });
}

// Export createWindow function to create the main window
export function createWindow(BrowserWindow) {
  // Global reference to prevent garbage collection
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../renderer/assets/icon.ico'),
    autoHideMenuBar: true,
    show: false
  });

  mainWindow.maximize();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
  
  return mainWindow;
}