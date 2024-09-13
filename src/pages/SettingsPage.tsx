import { useState, useEffect } from 'react'
import {
  Button,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider
} from '@mui/material'
import { MdDangerous } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [localInitiaPath, setLocalInitiaPath] = useState('')

  // Fetch the install path on component mount
  useEffect(() => {
    const fetchLocalInitiaPath = async () => {
      try {
        const path = await window.api.getStoreData('installPath')
        setLocalInitiaPath(path)
      } catch (error) {
        console.error('Error fetching toolbox path:', error)
      }
    }

    fetchLocalInitiaPath()
  }, [])

  const handleUninstallClick = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleConfirmUninstall = async () => {
    const isUninstall = await window.electron.ipcRenderer.invoke('uninstall')
    if (isUninstall) {
      navigate('/landing')
    }
    setOpen(false)
  }

  return (
    <Box className="flex flex-col w-full min-h-screen p-8 bg-gray-100">
      {/* Toolbox Path Section */}
      <Paper
        elevation={3}
        className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mb-8"
      >
        <Typography variant="h5" component="h1" gutterBottom className="font-bold text-gray-900">
          local-initia
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" gutterBottom className="text-gray-700">
          {localInitiaPath ? `Path: ${localInitiaPath}` : 'Fetching local-initia install path...'}
        </Typography>
      </Paper>

      {/* Uninstall Section */}
      <Paper
        elevation={3}
        className="p-6 bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto mb-8"
      >
        <Typography variant="h5" component="h1" gutterBottom className="font-bold text-gray-900">
          Uninstall
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body1" gutterBottom className="text-gray-700">
          This action will completely remove the local-initia from your system. Please make sure
          that you have backed up any important data before proceeding with the uninstallation
          process.
        </Typography>
        <Box className="flex flex-col items-start mt-6">
          <Button
            variant="contained"
            color="error"
            startIcon={<MdDangerous />}
            onClick={handleUninstallClick}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium text-sm hover:bg-red-700 transition-colors duration-300"
            sx={{ width: '100%' }}
          >
            Uninstall
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Uninstallation'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to uninstall local-initia? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmUninstall} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SettingsPage
