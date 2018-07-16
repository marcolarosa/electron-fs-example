const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let url = `file://${process.cwd()}/dist/index.html`;

app.on('ready', () => {
    let window = new BrowserWindow({width: 500, height: 500});
    window.loadURL(url);
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
