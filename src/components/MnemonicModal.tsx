import React, { memo } from 'react'
import { CopyButton } from './index'

interface MnemonicModalProps {
  mnemonic: string
  onClose: () => void
}

const MnemonicModal: React.FC<MnemonicModalProps> = ({ mnemonic, onClose }) => {
  return (
    <div className="bg-black bg-opacity-75 fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center">
        <div className="flex justify-between items-center pb-4 border-b border-gray-300">
          <h3 className="text-xl font-semibold text-gray-700">Mnemonic</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="mt-4 flex">
          <p className="leading-7 text-gray-600 text-left bg-gray-100 rounded-lg p-4">
            {mnemonic} <CopyButton text={mnemonic} classes="pt-2" />
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(MnemonicModal)
