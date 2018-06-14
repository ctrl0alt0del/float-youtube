"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const url = require("url");
const path = require("path");
let win;
let tray;
let lastValue;
function createWindow() {
    let options = {
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: true,
        icon: './fy.ico'
    };
    win = new electron_1.BrowserWindow(options);
    let wany = win;
    let isQuiting = false;
    wany.YoutubeURL = 'https://youtu.be/irjnYfUj660';
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('minimize', function (event) {
        event.preventDefault();
        win.hide();
    });
    win.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });
    tray = new electron_1.Tray('./fy.ico');
    const contextMenu = electron_1.Menu.buildFromTemplate([
        { label: 'app.show()', click: () => { win.show(); } },
        { label: 'app.forceToQuit()', click: () => { isQuiting = true; electron_1.app.quit(); } }
    ]);
    tray.setToolTip('youtube-float');
    tray.setContextMenu(contextMenu);
    electron_1.ipcMain.on('asynchronous-message', (event, arg) => {
        let clipValue = electron_1.clipboard.readText();
        if (clipValue.startsWith('https://youtu.be/')) {
            if (clipValue != lastValue) {
                win.show();
                lastValue = clipValue;
            }
            event.sender.send('asynchronous-reply', electron_1.clipboard.readText());
        }
    });
}
electron_1.app.on('ready', () => {
    createWindow();
});
electron_1.app.on('activate', () => {
    if (win === null)
        createWindow();
});
//# sourceMappingURL=index.js.map