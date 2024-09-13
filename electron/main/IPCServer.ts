import { app, BrowserWindow, ipcMain } from 'electron'
import { contractFinderDialog, messageDialog } from './dialogs'
import {
  download,
  publishModule,
  startInitia,
  stopInitia,
  subscribeInitiaEvents,
  uninstall
} from './initia'
import Store from 'electron-store'

interface Process {
  process?: any
  isStart?: boolean
}

const ProcessInfo: { initia: Process; minitia: Process } = {
  initia: {
    process: undefined,
    isStart: undefined
  },
  minitia: {
    process: undefined,
    isStart: undefined
  }
}

type IPCHandler = (mainWindow: BrowserWindow, store: Store) => void

const IPCServer: IPCHandler = (mainWindow: BrowserWindow, store: Store) => {
  ipcMain.handle('install', async () => {
    try {
      const installPath = await download()
      store.set('installPath', installPath)
      ProcessInfo.initia.process = await subscribeInitiaEvents(mainWindow, store)
    } catch (e) {
      if (e instanceof Error) {
        if (e.message.includes('Initia already downloaded')) {
          await messageDialog(
            `Initia already downloaded in the '${app.getPath('appData')}/local-initia'`
          )
          throw e
        }
      }
      await messageDialog(JSON.stringify(e))
    }
  })

  ipcMain.handle('toggleInitia', async (_, isOn) => {
    const installPath = store.get('installPath') as string

    if (isOn) {
      await startInitia(installPath)
      ProcessInfo.initia.process = await subscribeInitiaEvents(mainWindow, store)
    } else {
      await stopInitia(installPath)
    }
    return isOn
  })

  ipcMain.handle('publishModule', async () => {
    const { filePaths } = await contractFinderDialog()
    await publishModule(filePaths.toString())
    return filePaths.toString()
  })

  ipcMain.handle('uninstall', async () => {
    const installPath = store.get('installPath') as string
    store.delete('installPath')
    return await uninstall(installPath)
  })
}

export { IPCServer, ProcessInfo }
