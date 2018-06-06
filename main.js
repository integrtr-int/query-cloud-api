// main.js
// const { app, BrowserWindow } = require('electron');
const { app, BrowserWindow, Menu, protocol, ipcMain } = require('electron');
const path = require('path');
const nativeImage = require('electron').nativeImage;
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

const searchInPage = require('electron-in-page-search').default;


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


let template = []
if (process.platform === 'darwin') {
    // OS X
    const name = app.getName();
    // log.info(name);
    template.unshift({
        label: "Cloud API Query",
        submenu: [{
                label: 'About ',
                click() {
                    (function openAboutWin() {
                        var aboutWin = new BrowserWindow({
                            height: 185,
                            resizable: false,
                            width: 270,
                            title: "",
                            minimizable: false,
                            fullscreenable: false
                        });

                        aboutWin.loadURL('file://' + __dirname + '/about.html');

                        aboutWin.on('closed', function() {
                            aboutWin = null;
                        });

                    })();
                }

            },
            {
                label: 'EULA',
                click() {
                    (function openEULAWin() {
                        var eulaWin = new BrowserWindow({
                            height: 700,
                            resizable: false,
                            width: 500,
                            title: "",
                            minimizable: false,
                            fullscreenable: false
                        });

                        eulaWin.loadURL('file://' + __dirname + '/eula.html');

                        eulaWin.on('closed', function() {
                            eulaWin = null;
                        });

                    })();
                }

            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click() { app.quit(); }
            },
        ]
    }, {
        label: 'Edit',
        submenu: [{
                label: 'Undo',
                accelerator: 'Command+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+Command+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'Command+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'Command+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'Command+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'Command+A',
                selector: 'selectAll:'
            },
        ]
    }, {
        label: 'Find',
        submenu: [{
            label: 'Find',
            accelerator: 'Command+F',
            click() {
                let code = `search.openSearchWindow();`
                mainWindow.webContents.executeJavaScript(code);

            }
        }]
    })
} else {
    // Windows
    const name = app.getName();
    // log.info(name);
    template.unshift({
        label: "Cloud API Query",
        submenu: [{
                label: 'About ',
                click() {
                    (function openAboutWin() {
                        var aboutWin = new BrowserWindow({
                            height: 185,
                            resizable: false,
                            width: 270,
                            title: "",
                            minimizable: false,
                            fullscreenable: false
                        });

                        aboutWin.loadURL('file://' + __dirname + '/about.html');

                        aboutWin.on('closed', function() {
                            aboutWin = null;
                        });

                    })();
                }

            },
            {
                label: 'EULA',
                click() {
                    (function openEULAWin() {
                        var eulaWin = new BrowserWindow({
                            height: 700,
                            resizable: false,
                            width: 500,
                            title: "",
                            minimizable: false,
                            fullscreenable: false
                        });

                        eulaWin.loadURL('file://' + __dirname + '/eula.html');

                        eulaWin.on('closed', function() {
                            eulaWin = null;
                        });

                    })();
                }

            },
            {
                label: 'Quit',
                accelerator: 'Ctrl+Q',
                click() { app.quit(); }
            },
        ]
    }, {
        label: 'Edit',
        submenu: [{
                label: 'Undo',
                accelerator: 'Ctrl+Z',
                selector: 'undo:'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+Ctrl+Z',
                selector: 'redo:'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'Ctrl+X',
                selector: 'cut:'
            },
            {
                label: 'Copy',
                accelerator: 'Ctrl+C',
                selector: 'copy:'
            },
            {
                label: 'Paste',
                accelerator: 'Ctrl+V',
                selector: 'paste:'
            },
            {
                label: 'Select All',
                accelerator: 'Ctrl+A',
                selector: 'selectAll:'
            },
        ]
    }, {
        label: 'Find',
        submenu: [{
            label: 'Find',
            accelerator: 'Command+F',
            click() {
                let code = `search.openSearchWindow();`
                mainWindow.webContents.executeJavaScript(code);

            }
        }]
    })
}


let appIcon = nativeImage.createFromPath(__dirname + '/assets/icon/mac/64x64.png');
let mainWindow;

app.on('ready', () => {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        icon: appIcon
    });
    mainWindow.loadURL('file://' + __dirname + '/webapp/index.html');
    if (process.env.ELECTRON_IN_PAGE_SEARCH_DEBUG) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
});




autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});
app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();
});