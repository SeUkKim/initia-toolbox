import { ElectronAPI } from '@electron-toolkit/preload'
import { LocalInitia } from '@initia/initia.js'

interface API {
  getStoreData: (key: string) => Promise<any>
  setStoreData: (key: string, value: any) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
    initia: LocalInitia
  }
}
