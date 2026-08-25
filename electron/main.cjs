const { app, BrowserWindow, ipcMain, Notification, Menu, Tray, screen } = require('electron');
const path = require('path');

let mainWindow = null;
let widgetWindow = null;
let tray = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 650,
    title: 'An Lịch AI - Xem ngày • Hiểu mình • Sống an',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Hide to Tray on minimize/close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../public/favicon.ico');
  tray = new Tray(iconPath);
  tray.setToolTip('An Lịch AI - Xem ngày • Hiểu mình • Sống an');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '📅 Hôm Nay',
      click: () => {
        showMainWindow();
        if (mainWindow) mainWindow.webContents.send('navigate-tab', 'calendar');
      }
    },
    {
      label: '🤖 Hỏi AI Luận Tử Vi',
      click: () => {
        showMainWindow();
        if (mainWindow) mainWindow.webContents.send('navigate-tab', 'ai');
      }
    },
    {
      label: '⏰ Giờ Đẹp & Hoàng Đạo',
      click: () => {
        showMainWindow();
        if (mainWindow) mainWindow.webContents.send('navigate-tab', 'calendar');
      }
    },
    {
      label: '🛕 Lễ Hội & Sự Kiện',
      click: () => {
        showMainWindow();
        if (mainWindow) mainWindow.webContents.send('navigate-tab', 'events');
      }
    },
    { type: 'separator' },
    {
      label: '📌 Hiện/Ẩn Widget Desktop',
      click: () => {
        if (mainWindow) mainWindow.webContents.send('toggle-widget');
      }
    },
    {
      label: '⚙️ Cài Đặt',
      click: () => {
        showMainWindow();
        if (mainWindow) mainWindow.webContents.send('navigate-tab', 'settings');
      }
    },
    { type: 'separator' },
    {
      label: '❌ Thoát Ứng Dụng',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    showMainWindow();
  });
}

function showMainWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  } else {
    createMainWindow();
  }
}

// Native Desktop Notifications
ipcMain.on('show-notification', (event, { title, body, icon }) => {
  if (Notification.isSupported()) {
    const notification = new Notification({
      title: title || 'An Lịch AI',
      body: body || '',
      icon: icon || undefined
    });
    notification.show();
    notification.on('click', () => {
      showMainWindow();
    });
  }
});

app.whenReady().then(() => {
  createMainWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
