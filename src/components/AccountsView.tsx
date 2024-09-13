import { memo, useEffect, useState, useCallback } from 'react'
import { AccountsDetailView, CopyButton, MnemonicModal } from './index'
import { IoMdKey } from 'react-icons/io'
import { Collapse } from '@mui/material'
import { useInitiaAccount, useIsInitiaStart } from '../hooks/InitiaHooks'
import { tokenToFloat, truncate } from '../util'
import { Denom } from '@initia/initia.js'
import { MdKeyboardArrowDown } from 'react-icons/md'

function AccountsView({ wallet, gridColumns }: { wallet: any; gridColumns: string }) {
  const { accAddress, mnemonic } = wallet.key

  const [balance, setBalance] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpended] = useState(false)
  const { getBalance } = useInitiaAccount()
  const isInitiaStart = useIsInitiaStart()

  const toggleDetail = useCallback(() => {
    setIsExpended(!isExpanded)
  }, [isExpanded])

  const handleOpenMnemonicModal = () => setIsModalOpen(true)
  const handleCloseMnemonicModal = () => setIsModalOpen(false)

  useEffect(() => {
    if (!isInitiaStart.get()) return

    getBalance(accAddress).then((coins: any) => {
      if (coins.length > 0) {
        const { amount } = coins.find(({ denom }: { denom: Denom }) => denom === 'uinit')
        setBalance(tokenToFloat(Number(amount)))
      }
    })
  }, [isInitiaStart])

  return (
    <div>
      <div
        role="row"
        tabIndex={0}
        onClick={toggleDetail}
        className="cursor-pointer px-10 py-5 grid items-center font-medium border-b border-[#EBEFF8] hover:bg-[#F9FBFE] transition-colors duration-300"
        style={{ gridTemplateColumns: gridColumns }}
      >
        {/* Account Address */}
        <div className="flex items-center space-x-2 text-gray-800 text-sm">
          <p>{truncate(accAddress, [12, 10])}</p>
          <CopyButton text={accAddress} classes="h-8 w-8" />
        </div>

        {/* Balance */}
        <div className="text-gray-800 text-sm">{balance}</div>

        {/* Mnemonic and Arrow */}
        <div className="flex items-center text-sm">
          <button onClick={handleOpenMnemonicModal}>
            <IoMdKey className="h-8 w-8" />
          </button>
        </div>
        <div className="flex justify-end text-sm">
          <MdKeyboardArrowDown
            size={24}
            className={`transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </div>
      </div>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit className="px-10 py-7">
        <div className="flex items-center space-x-2">
          <AccountsDetailView wallet={wallet} />
        </div>
      </Collapse>

      {/* Mnemonic Modal */}
      {isModalOpen && <MnemonicModal mnemonic={mnemonic} onClose={handleCloseMnemonicModal} />}
    </div>
  )
}

export default memo(AccountsView)
