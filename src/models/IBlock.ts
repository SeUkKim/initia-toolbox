import { BlockInfo } from '@initia/initia.js'
import { IEvent } from './IEvent'

export interface IBlock {
  blocks: IBlockInfo[]
  latestHeight: number
}

export interface IBlockInfo extends BlockInfo {
  result_finalize_block: {
    events: IEvent[]
  }
  hasEvents?: boolean
}
