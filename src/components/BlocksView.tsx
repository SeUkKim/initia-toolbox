import { IBlockInfo } from '../models/IBlock'
import React, { memo, useCallback } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Collapse } from '@mui/material'
import { EventsView } from './index'
import { useInitiaTxByHeight } from '../hooks/InitiaHooks'

type BlocksViewProps = {
  data: IBlockInfo
  index: number
  gridColumns: string
  onToggleDetail: (index: number) => void
}

const BlocksView: React.FC<BlocksViewProps> = ({ data, index, gridColumns, onToggleDetail }) => {
  const {
    block: {
      header: { height, time }
    },
    result_finalize_block,
    hasEvents
  } = data
  const txs = useInitiaTxByHeight(parseInt(height, 10))

  // Format timestamp
  const formattedTime = new Date(time).toUTCString()

  // Calculate gas usage
  const totalGasUsed = txs.reduce((acc, tx) => acc + tx.gas_used, 0)
  const totalGasWanted = txs.reduce((acc, tx) => acc + tx.gas_wanted, 0)

  // Toggle detail handler
  const toggleDetail = useCallback(() => onToggleDetail(index), [onToggleDetail, index])

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        onClick={toggleDetail}
        className="cursor-pointer px-10 py-5 grid items-center font-medium border-b border-[#EBEFF8] hover:bg-[#F9FBFE] transition-colors duration-300"
        style={{ gridTemplateColumns: gridColumns }}
      >
        {/* Block Height */}
        <div className="text-gray-800 text-sm">{height}</div>

        {/* Transactions */}
        <div className="text-gray-800 text-sm">{txs.length}</div>

        {/* Gas */}
        <div className="text-gray-800 text-sm">
          {totalGasUsed} / {totalGasWanted}
        </div>

        {/* Timestamp */}
        <div className="text-gray-600 text-sm">{formattedTime}</div>

        {/* Toggle Arrow */}
        <div className="flex justify-end items-center">
          <MdKeyboardArrowDown
            size={24}
            className={`transition-transform duration-300 transform ${hasEvents ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>

      {/* Events View */}
      <Collapse in={hasEvents} timeout="auto" unmountOnExit className="px-20 py-7">
        <EventsView events={result_finalize_block.events} />
      </Collapse>
    </div>
  )
}

export default memo(BlocksView)
