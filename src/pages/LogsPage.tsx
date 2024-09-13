import { LogsView } from '../components'
import { useInitiaLogs } from '../hooks/InitiaHooks'
import { Virtuoso } from 'react-virtuoso'

const LogsPage = () => {
  const logs = useInitiaLogs()

  return (
    <div className="pl-4 w-full">
      <Virtuoso
        className="flex flex-col w-full"
        initialTopMostItemIndex={logs.length}
        data={logs}
        itemContent={(index, log) => <LogsView key={index} log={log} />}
      ></Virtuoso>
    </div>
  )
}

export default LogsPage
