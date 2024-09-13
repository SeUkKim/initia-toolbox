import { useInitia } from '../hooks/InitiaHooks'
import { Virtuoso } from 'react-virtuoso'
import { AccountsView } from '../components'

const AccountsPage = () => {
  const { getAccounts } = useInitia()
  const accounts = getAccounts()
  const columns = '1fr 1fr 1fr auto' // Adjusted to match the general layout approach

  return (
    <div className="flex flex-col w-full">
      {/* Header Row */}
      <div
        className="grid items-center w-full px-10 py-5 bg-gray-50 text-gray-500 font-semibold text-xs uppercase border-b border-gray-200 shadow-sm"
        style={{ gridTemplateColumns: columns }}
      >
        <div>Address</div>
        <div>Init</div>
        <div>Mnemonic</div>
        <div className="flex justify-end" />
      </div>

      {/* Accounts List */}
      <Virtuoso
        followOutput
        className="flex flex-col w-full"
        style={{ overflow: 'overlay' }}
        data={accounts}
        itemContent={(_, account) => (
          <AccountsView wallet={account} key={account.key.accAddress} gridColumns={columns} />
        )}
      />
    </div>
  )
}

export default AccountsPage
