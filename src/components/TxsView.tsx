import React, { memo, useState } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Collapse } from '@mui/material'
import EventsView from './EventsView'
import { truncate } from '../util'
import { ITx } from '../models/ITx'
import { CopyButton } from './index'

interface TxsViewProps {
  data: ITx
  index: number
  gridColumns: string
  onToggleDetail: (index: number) => void
}

const TxsView: React.FC<TxsViewProps> = ({ data, index, gridColumns, onToggleDetail }) => {
  const { txhash, result, height } = data.TxResult
  const [open, setOpen] = useState(data.hasEvents)

  // Toggle detail handler
  const toggleDetail = () => {
    setOpen((prevOpen) => !prevOpen)
    onToggleDetail(index)
  }

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        onClick={toggleDetail}
        className="cursor-pointer px-10 py-5 grid items-center font-medium border-b border-[#EBEFF8] hover:bg-[#F9FBFE] transition-colors duration-300"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div className="text-gray-800 text-sm">{height}</div>
        <div className="flex text-gray-800 text-sm">
          <span>{truncate(txhash, [10, 10])}</span>
          <CopyButton text={txhash} classes="h-4 w-4 ml-2" />
        </div>
        <div />
        <div className="flex text-gray-800 text-sm">
          {truncate(data.msg['from_address'], [10, 5])}
          <CopyButton text={data.msg['from_address']} classes="h-4 w-4 ml-2" />
        </div>
        <div className="text-gray-800 text-sm">{data.msg['@type'].split('.').pop()}</div>
        <div className="flex justify-end">
          <MdKeyboardArrowDown
            size={24}
            className={`transition-transform duration-300 transform ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>
      <Collapse in={open} timeout="auto" unmountOnExit className="px-20 py-7">
        <EventsView events={result.events} />
      </Collapse>
    </div>
  )
}

export default memo(TxsView)
