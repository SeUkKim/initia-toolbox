import { hookstate } from '@hookstate/core'
import { useEffect } from 'react'
import { IBlock, IBlockInfo } from '../models/IBlock'
import { ITx } from '../models/ITx'

export const isInitiaStart = hookstate<boolean | null>(null)
export const isInstalled = hookstate<boolean>(false)
window.api.getStoreData('installPath').then((installPath) => isInstalled.set(!!installPath))
export const initiaLogState = hookstate<string[]>([])
export const initiaBlockState = hookstate<IBlock>({ blocks: [], latestHeight: 0 })
export const initiaTxState = hookstate<ITx[]>([])

const IPCListener: React.FC = () => {
  useEffect(() => {
    window.electron.ipcRenderer.on('isInstalled', (_: any, installed: boolean) => {
      isInstalled.set(installed)
    })

    window.electron.ipcRenderer.on('isInitiaStart', (_: any, started: boolean) => {
      isInitiaStart.set(started)
    })

    window.electron.ipcRenderer.on('initiaLog', (_: any, log: string) => {
      if (initiaLogState.length >= 500) {
        initiaLogState.set((l) => l.slice(1).concat(log))
      } else {
        initiaLogState.merge([log])
      }
    })
    window.electron.ipcRenderer.on('initiaNewBlock', (_: any, block: IBlockInfo) => {
      initiaBlockState.latestHeight.set(Number(block.block.header.height))
      initiaBlockState.blocks.set((b) => [...b, block])
    })
    window.electron.ipcRenderer.on('initiaTx', (_: any, tx: ITx) => {
      initiaTxState.merge([{ ...tx }])
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('isInstalled')
      window.electron.ipcRenderer.removeAllListeners('isInitiaStart')
      window.electron.ipcRenderer.removeAllListeners('initiaLog')
      window.electron.ipcRenderer.removeAllListeners('initiaNewBlock')
      window.electron.ipcRenderer.removeAllListeners('initiaTx')
    }
  }, [isInstalled, isInitiaStart, initiaLogState, initiaBlockState, initiaTxState])

  return null
}

export default IPCListener
