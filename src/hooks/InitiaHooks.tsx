import { useHookstate } from '@hookstate/core'
import {
  initiaBlockState,
  initiaLogState,
  initiaTxState,
  isInitiaStart,
  isInstalled
} from './IPCListener'
import { useContext, useEffect, useState } from 'react'
import { InitiaContextProvider } from '../components/InitiaContextProvider'
import { IInitia, IInitiaAccount } from '../models/IInitia'
import { TxInfo, Wallet } from '@initia/initia.js'

export const useIsInitiaStart = () => useHookstate(isInitiaStart)
export const useIsInstalled = () => useHookstate(isInstalled)
export const useInitiaLogs = () => useHookstate(initiaLogState).get()
export const useInitiaLatestHeight = () => {
  const blocks = useInitiaBlocks()
  const { latestHeight } = blocks.get()
  return latestHeight | 0
}
export const useInitiaBlocks = () => useHookstate(initiaBlockState)
export function useInitiaTxByHeight(height?: number) {
  const initia = useContext(InitiaContextProvider)
  const [txInfo, setInfo] = useState<TxInfo[]>([])
  useEffect(() => {
    initia?.tx.txInfosByHeight(height).then((tx) => {
      setInfo(tx as TxInfo[])
    })
  }, [])
  return txInfo
}
export const useInitiaTx = () => useHookstate(initiaTxState)
export function useInitia() {
  const initia = useContext(InitiaContextProvider)
  if (!initia) {
    throw new Error('Initia context is not available')
  }
  const localInitia: IInitia = {
    initia,
    wallets: initia?.wallets,
    getAccounts(): Wallet[] {
      return Object.values(initia!.wallets)
    }
  }
  return localInitia
}
export function useInitiaAccount() {
  const initia = useContext(InitiaContextProvider)
  const accountInfo: IInitiaAccount = {
    ...useInitia(),
    getBalance: async (address: string) => {
      const [coins] = await initia!.bank.balance(address)
      return coins.toData()
    }
  }
  return accountInfo
}
export function useAccountTx(address: string) {
  const [txs, setTxs] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)
  const initia = useContext(InitiaContextProvider)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${initia!.URL}/cosmos/tx/v1beta1/txs?query=message.sender='${address}'&page=${page}&limit=${limit}`
        )
        const data = await response.json()

        if (response.ok) {
          setTxs(data.tx_responses || [])
          setTotalPages(Math.ceil(data.total / limit))
        } else {
          setError(`Error: ${data.error || 'Unknown error'}`)
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(`Error: ${e.message}`)
        } else {
          setError('Error: Unknown error')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [address, page, limit])

  return { txs, loading, error, page, setPage, totalPages }
}
