//import { app, BrowserWindow } from 'electron';
var R=require('electron')
let mainWindow = null;

R.app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    R.app.quit();
  }
});

R.app.on('ready', () => {
  mainWindow = new R.BrowserWindow({width: 1000, height: 850});
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
