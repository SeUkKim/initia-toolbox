import { SelectWallet } from '../components'
import { useState } from 'react'
import { Button, SelectChangeEvent } from '@mui/material'
import { FaPlus } from 'react-icons/fa'

const PublishPage = () => {
  const [selectedWallet, setSelectedWallet] = useState('validator')
  const [contracts, setContracts] = useState([])

  const handleWalletChange = (event: SelectChangeEvent) => {
    setSelectedWallet(event.target.value)
  }

  const handleAddContract = async () => {
    const added = await window.electron.ipcRenderer.invoke('publishModule')
    setContracts(added)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full items-center px-10 py-5 bg-gray-50 shadow-sm border-gray-200 gap-4">
        <SelectWallet onWalletChange={handleWalletChange} selected={selectedWallet} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={handleAddContract}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-white font-medium text-sm hover:bg-blue-600 transition-colors duration-300"
          sx={{
            width: '100%'
          }}
        >
          Add Contract
        </Button>
      </div>
    </div>
  )
}

export default PublishPage
