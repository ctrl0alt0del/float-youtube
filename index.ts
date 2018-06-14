import { app, BrowserWindow, clipboard, ipcMain, Tray, Menu, BrowserWindowConstructorOptions } from 'electron';
import url = require('url');
import path = require('path');
let win: BrowserWindow;
let tray;
let lastValue: string;
function createWindow() {
    let options: BrowserWindowConstructorOptions = {
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        resizable: true,
        icon: './fy.ico'
    }
    win = new BrowserWindow(options);
    let wany: any = win;
    let isQuiting = false;
    wany.YoutubeURL = 'https://youtu.be/irjnYfUj660';
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('minimize', function (event) {
        event.preventDefault()
        win.hide();
    });
    win.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault()
            win.hide();
        }
        return false;
    });
    tray = new Tray('./fy.ico');
    const contextMenu = Menu.buildFromTemplate([
        { label: 'app.show()', click: () => { win.show(); } },
        { label: 'app.forceToQuit()', click: () => { isQuiting = true; app.quit() } }
    ])
    tray.setToolTip('youtube-float')
    tray.setContextMenu(contextMenu)
    ipcMain.on('asynchronous-message', (event, arg) => {
        let clipValue = clipboard.readText();
        if (clipValue.startsWith('https://youtu.be/')) {
            if (clipValue != lastValue) {
                win.show();
                lastValue = clipValue;
            }
            event.sender.send('asynchronous-reply', clipboard.readText());
        }
    })
}
app.on('ready', () => {
    createWindow()
})
app.on('activate', () => {
    if (win === null) createWindow();
})