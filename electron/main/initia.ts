import { exec as callback, spawn } from 'child_process'
import * as util from 'util'
import * as path from 'path'
import { app, BrowserWindow } from 'electron'
import * as fs from 'fs'
import Store from 'electron-store'
import { ChildProcess } from 'node:child_process'
import { ProcessInfo } from './IPCServer'
import { messageDialog, messageNotification } from './dialogs'
import waitOn from 'wait-on'
import { Tx, WebSocketClient } from '@initia/initia.js'
import { MoveBuilder } from '@initia/builder.js'

const exec = util.promisify(callback)

let blockWebSocket = new WebSocketClient('ws://localhost:26657/websocket')
let txWebSocket = new WebSocketClient('ws://localhost:26657/websocket')

export const isDockerStart = async (): Promise<boolean> => {
  try {
    await exec('docker ps', {
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`
      }
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const download = async (): Promise<string> => {
  const gitAddress = 'https://github.com/SeUkKim/local-initia.git'
  const installPath = path.join(app.getPath('appData'), 'local-initia')
  if (fs.existsSync(installPath)) {
    throw new Error(`Initia already downloaded at '${installPath}'`)
  } else {
    await exec(`git clone ${gitAddress} --depth 1`, {
      cwd: app.getPath('appData'),
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin`
      }
    })
  }

  await startInitia(installPath)

  return installPath
}

export const startInitia = async (installPath: string): Promise<void> => {
  try {
    await exec(`docker compose up -d --wait --remove-orphans initiad`, {
      cwd: installPath,
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin`
      }
    })
    await waitOn({
      resources: ['http://localhost:26657']
    })
  } catch (e) {
    await messageDialog(JSON.stringify(e))
  }
}

export const stopInitia = async (installPath: string): Promise<void> => {
  try {
    await exec('docker compose stop initiad', {
      cwd: installPath,
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`
      }
    })
    ProcessInfo.initia.isStart = false
    blockWebSocket.destroy()
    txWebSocket.destroy()
    await messageNotification('Stopping Initia')
  } catch (e) {
    await messageDialog(JSON.stringify(e))
  }
}

export const uninstall = async (installPath: string): Promise<boolean> => {
  try {
    await exec('docker compose down --rmi all --volumes', {
      cwd: installPath,
      env: {
        PATH: `${process.env.PATH}:/usr/local/bin/`
      }
    })
    ProcessInfo.initia.isStart = false
    blockWebSocket.destroy()
    txWebSocket.destroy()

    await fs.promises.rm(installPath, { recursive: true })
    await messageNotification('Successfully Uninstalled')
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const publishModule = async (contractPath: string): Promise<void> => {
  const builder = new MoveBuilder(contractPath, {})
  const ok = await builder.build()
  console.log(ok)
}

export const subscribeInitiaEvents = async (
  mainWindow: BrowserWindow,
  store: Store
): Promise<ChildProcess> => {
  const installPath = (await store.get('installPath')) as string
  const initiaProcess = spawn('docker', ['compose', 'logs', 'initiad', '-f'], {
    cwd: installPath,
    env: {
      PATH: `${process.env.PATH}:/usr/local/bin/`
    }
  })

  if (!blockWebSocket) {
    blockWebSocket = new WebSocketClient('ws://localhost:26657/websocket')
  }
  if (!txWebSocket) {
    txWebSocket = new WebSocketClient('ws://localhost:26657/websocket')
  }

  initiaProcess.stdout.on('data', async (data: Buffer) => {
    try {
      if (mainWindow.isDestroyed()) return

      mainWindow.webContents.send('initiaLog', data.toString())

      if (!ProcessInfo.initia.isStart) {
        blockWebSocket.subscribe('NewBlock', {}, ({ value }) => {
          mainWindow.webContents.send('initiaNewBlock', value)
        })
        txWebSocket.subscribeTx({}, async ({ value }) => {
          // TODO: handle skip's tx.
          if (value.TxResult.result.code) {
            return
          }
          const msg = parseTx(value.TxResult.tx)
          mainWindow.webContents.send('initiaTx', { msg, ...value })
        })

        blockWebSocket.start()
        txWebSocket.start()

        ProcessInfo.initia.isStart = true
        mainWindow.webContents.send('isInstalled', true)
        mainWindow.webContents.send('isInitiaStart', true)

        await messageNotification('Starting Initia')
      }
    } catch (e) {
      console.error(`stdout: ${e}`)
    }
  })

  initiaProcess.stderr.on('data', (data: Buffer) => {
    console.error(`stderr: ${data.toString()}`)
  })

  initiaProcess.on('close', () => {
    try {
      if (mainWindow.isDestroyed()) return

      ProcessInfo.initia.isStart = false
      mainWindow.webContents.send('isInitiaStart', false)
    } catch (e) {
      console.error(`Error closing initia process: ${e}`)
    }
  })

  return initiaProcess
}

const parseTx = (tx) => {
  const unpack = Tx.unpackAny({ value: Buffer.from(tx, 'base64'), typeUrl: '' })
  return unpack.body.messages[0].toData()
}
