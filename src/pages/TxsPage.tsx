import { useInitiaTx } from '../hooks/InitiaHooks'
import { Virtuoso } from 'react-virtuoso'
import { TxsView } from '../components'

const TxsPage = () => {
  const { get: getTxs, set: setTxs } = useInitiaTx()
  const txs = getTxs()
  const columns = '1fr 2fr 0.5fr 2fr 1fr 1fr'

  const toggleDetail = (index: number) => {
    txs[index].hasEvents = !txs[index].hasEvents
    setTxs([...txs]) // Ensure the state update triggers a re-render
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className="grid items-center w-full px-10 py-5 bg-gray-50 text-gray-500 font-semibold text-xs uppercase border-b border-gray-200 shadow-sm"
        style={{ gridTemplateColumns: columns }}
      >
        <div>Height</div>
        <div>Hash</div>
        <div />
        <div>Sender</div>
        <div>Message</div>
      </div>
      <Virtuoso
        followOutput
        className="flex flex-col w-full"
        style={{ overflow: 'overlay' }}
        data={txs}
        itemContent={(index, tx) => (
          <TxsView
            key={tx.TxResult.txhash}
            onToggleDetail={toggleDetail}
            data={tx}
            index={index}
            gridColumns={columns}
          />
        )}
      />
    </div>
  )
}

export default TxsPage
