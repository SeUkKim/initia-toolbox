import { IConfig } from '../models/IConfig'
import { createContext, ReactNode, useMemo } from 'react'
import { LocalInitia } from '@initia/initia.js'

export const InitiaContextProvider = createContext<LocalInitia | undefined>(undefined)

interface InitiaProviderProps {
  children: ReactNode
  config?: IConfig
}

const initiaConfig: IConfig = {
  url: 'http://localhost:1317',
  chainId: 'local-initia'
}

const InitiaProvider = ({ children, config = initiaConfig }: InitiaProviderProps) => {
  const initia = useMemo(() => new LocalInitia(), [config])
  return <InitiaContextProvider.Provider value={initia}>{children}</InitiaContextProvider.Provider>
}

export default InitiaProvider
