import { IEvent } from './IEvent'

export interface ITx {
  TxResult: ITxResult
  msg: ITxMsg
  hasEvents?: boolean
}

export interface ITxResult {
  height: string
  result: ITxSimResult
  tx: string
  txhash: string
}

export interface ITxSimResult {
  data: string
  events: IEvent[]
  gas_used: string
  gas_wanted: string
  log: string
}

export interface ITxMsg {
  '@type': string
}
