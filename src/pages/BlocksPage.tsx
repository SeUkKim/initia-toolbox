import { useInitiaBlocks } from '../hooks/InitiaHooks'
import { useCallback } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { BlocksView } from '../components'

const BlocksPage = () => {
  const blocks = useInitiaBlocks()
  const data = blocks.get()
  const columns = '1fr 1fr 2fr 2fr auto'

  const toggleDetail = useCallback(
    (index: number) => {
      blocks.blocks[index].merge({
        hasEvents: !data.blocks[index].hasEvents
      })
    },
    [blocks]
  )

  return (
    <div className="flex flex-col w-full">
      {/* Header Row */}
      <div
        className="grid items-center w-full px-10 py-5 bg-gray-50 text-gray-500 font-semibold text-xs uppercase border-b border-gray-200 shadow-sm"
        style={{ gridTemplateColumns: columns }}
      >
        <div>Block Height</div>
        <div>Transactions</div>
        <div>Gas(Used/Wanted)</div>
        <div>Timestamp</div>
        <div />
      </div>

      {/* Blocks List */}
      <Virtuoso
        followOutput
        className="flex flex-col w-full"
        style={{ overflow: 'overlay' }}
        data={data.blocks}
        itemContent={(index, block) => (
          <BlocksView
            key={index}
            onToggleDetail={toggleDetail}
            data={block}
            index={index}
            gridColumns={columns}
          />
        )}
      />
    </div>
  )
}

export default BlocksPage
