import React, { memo } from 'react'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { Badge, Collapse } from '@mui/material'
import { extractMessageTypAndCount, truncate } from '../util'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CopyButton } from './index'

type AccountsTxsViewProps = {
  data: any // Transaction data type
  index: number
  gridColumns: string
  isExpanded: boolean
  onToggleDetail: (index: number) => void
}

const AccountsTxsView: React.FC<AccountsTxsViewProps> = ({
  data,
  index,
  gridColumns,
  isExpanded,
  onToggleDetail
}) => {
  const { height, txhash, timestamp } = data
  const formattedTime = new Date(timestamp).toUTCString()
  const messageTypesCount = extractMessageTypAndCount(data.tx.body.messages)

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        onClick={() => onToggleDetail(index)}
        className="cursor-pointer px-10 py-5 grid items-center font-medium border-b border-[#EBEFF8] hover:bg-[#F9FBFE] transition-colors duration-300"
        style={{ gridTemplateColumns: gridColumns }}
      >
        <div className="text-gray-800 text-sm">{height}</div>

        {/* Transaction Hash */}
        <div className="text-gray-800 text-sm">
          {truncate(txhash, [5, 5])}
          <CopyButton text={txhash} classes="h-4 w-4 pt-2" />
        </div>

        {/*/!* Messages with counts *!/*/}
        <div className="text-gray-800 text-sm flex space-x-2 ml-2">
          {Object.entries(messageTypesCount).map(([messageType, count]) => (
            <div key={messageType} className="flex items-center space-x-1">
              <span>{messageType}</span>
              <Badge
                className="top-1.5"
                badgeContent={count}
                color={'info'}
                sx={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
              />
            </div>
          ))}
        </div>

        {/*/!* Timestamp *!/*/}
        <div className="text-gray-600 text-sm ml-3">{formattedTime}</div>

        {/* Toggle Arrow */}
        <div className="flex justify-end items-center">
          <MdKeyboardArrowDown
            size={24}
            className={`transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>

      {/* Transaction Detail View */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit className="px-20 py-7">
        <div className="text-sm text-gray-600">
          <strong>Transaction Details:</strong>
          <SyntaxHighlighter
            language="json"
            style={coy}
            customStyle={{ borderRadius: '8px', padding: '15px' }}
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      </Collapse>
    </div>
  )
}

export default memo(AccountsTxsView)
