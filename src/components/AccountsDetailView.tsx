import { AccAddress, Wallet } from '@initia/initia.js'
import { memo, SyntheticEvent, useCallback, useState } from 'react'
import { useAccountTx } from '../hooks/InitiaHooks'
import { Virtuoso } from 'react-virtuoso'
import { AccountsTxsView, CopyButton } from './index'
import { Tabs, Tab, Box } from '@mui/material'

const AccountsDetailView = ({ wallet }: { wallet: Wallet }) => {
  const address = wallet.key.accAddress
  const { txs, loading, error, page, setPage, totalPages } = useAccountTx(address)
  const [expandedRows, setExpandedRows] = useState<number[]>([]) // Track expanded rows
  const [tabIndex, setTabIndex] = useState(0) // Use tabIndex to manage active tab

  const toggleDetail = useCallback((index: number) => {
    setExpandedRows(
      (prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index) // Collapse if already expanded
          : [...prev, index] // Expand if not yet expanded
    )
  }, [])

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    console.log(event)
    setTabIndex(newValue)
  }

  return (
    <Box className="flex flex-col w-full">
      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleChangeTab}
        aria-label="account details tabs"
        className="mb-4"
      >
        <Tab label="Account Info" />
        <Tab label="Transactions" />
      </Tabs>

      {/* Tab Content */}
      <Box className="flex flex-col w-full item-center">
        {tabIndex === 0 && (
          <div className="p-4">
            <div>
              <p>
                <strong>Account Address:</strong> {address}
                <CopyButton text={address} classes="h-4 w-4 pt-2" />
              </p>
              <p>
                <strong>HEX:</strong> {AccAddress.toHex(address)}
                <CopyButton text={AccAddress.toHex(address)} classes="h-4 w-4 pt-2" />
              </p>
            </div>
          </div>
        )}
        {tabIndex === 1 && (
          <>
            {/* Transactions Header Row */}
            <div
              className="grid items-center w-full px-10 py-5 bg-gray-50 text-gray-500 font-semibold text-xs uppercase border-b border-gray-200 shadow-sm"
              style={{ gridTemplateColumns: '1fr 1fr 1fr 2fr auto' }}
            >
              <div>Height</div>
              <div>TX Hash</div>
              <div>Messages</div>
              <div>Timestamp</div>
              <div />
            </div>

            {/* Display loading or error state */}
            {loading && <div className="text-center py-10">Loading...</div>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}

            {/* Transactions List */}
            {!loading && !error && txs.length > 0 && (
              <>
                <Virtuoso
                  followOutput
                  className="flex flex-col w-full h-full"
                  style={{ overflow: 'overlay', height: '500px' }}
                  data={txs} // Use the transactions from the hook
                  itemContent={(index, tx) => (
                    <AccountsTxsView
                      key={index}
                      onToggleDetail={toggleDetail}
                      data={tx}
                      index={index}
                      isExpanded={expandedRows.includes(index)} // Check if this row is expanded
                      gridColumns={'1fr 1fr 1fr 2fr auto'}
                    />
                  )}
                />

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {'<'}
                  </button>
                  <span className="px-4 py-2">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {'>'}
                  </button>
                </div>
              </>
            )}

            {!loading && !error && txs.length === 0 && (
              <div className="text-center py-10">No transactions available.</div>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default memo(AccountsDetailView)
