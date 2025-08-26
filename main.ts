import { app, ipcMain, session, BrowserWindow, Tray, Menu } from "electron"
import path from "node:path"
import { fileURLToPath } from "url"
import { createTrayImage } from "./helpers/createTrayIcon.ts"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win: BrowserWindow
let tray: Tray

app.dock?.hide()

const createWindow = () => {
  win = new BrowserWindow({
    backgroundColor: "#111827",
    width: 8 * 35,
    height: 8 * 75,
    modal: true,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  })

  win.loadFile("index.html")

  win.on("close", (event: Electron.Event) => {
    event.preventDefault()
    win.hide()
  })

  win.on("blur", (event: Electron.Event) => {
    event.preventDefault()
    win.hide()
  })
}

function createTray() {
  const icon = createTrayImage()
  tray = new Tray(icon) // Replace with your icon path
  tray.setToolTip("ZS (Get off your laZy aSs)")
  tray.setIgnoreDoubleClickEvents(true)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Hide App",
      click: () => {
        win.hide()
      },
    },
    {
      label: "Exit",
      click: () => {
        app.quit()
      },
    },
  ])

  tray.on("right-click", function (event) {
    tray.popUpContextMenu(contextMenu)
  })

  // tray.on('double-click', (event) => {
  //   console.log('here here')
  // })

  tray.on("click", (event) => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
      positionAppWindow(win, tray)
    }
  })
}

app.whenReady().then(() => {
  ipcMain.on("setTrayIcon", (event: Electron.IpcMainEvent, text: string) => {
    const duration = text ? `ZS ${text}` : 'ZS'
    const image = createTrayImage(duration)
    tray.setImage(image)
  })

  createWindow()
  createTray()

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
      },
    })
  })
})

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })

app.on("before-quit", () => {
  if (tray) {
    tray.destroy() // Destroy the tray icon when the app is about to quit
  }
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

function positionAppWindow(win, tray) {
  // // Calculate position to open near the tray
  const trayBounds = tray.getBounds()

  // // Adjust position based on OS and desired placement (e.g., above or below tray)
  let x = trayBounds.x + trayBounds.width / 2 - win.getSize()[0] / 2
  let y = trayBounds.y - win.getSize()[1] // Example: above the tray

  // // Ensure window stays within screen bounds
  if (y < 0) y = trayBounds.y + trayBounds.height // If too high, open below
  win.setPosition(Math.round(x), Math.round(y))
}
