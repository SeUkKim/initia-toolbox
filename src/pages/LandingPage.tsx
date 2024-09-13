import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Checkbox, CircularProgress, FormControlLabel, FormGroup } from '@mui/material'

const LandingPage = () => {
  const navigate = useNavigate()
  const [isDockerStart, setIsDockerStart] = useState<boolean>(false)
  const handleChange = (event: any) => setIsDockerStart(event.target.checked)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const onInstall = async () => {
    try {
      if (isLoading) {
        return
      }
      setIsLoading(true)
      await window.electron.ipcRenderer.invoke('install')
      navigate('/')
      return
    } catch (error) {
      setIsLoading(false)
      return error
    }
  }

  return (
    <div className="bg-black flex items-center justify-center fixed top-0 left-0 right-0 bottom-0 h-screen z-50">
      <div className="flex flex-col items-center justify-center space-x-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="mb-12">
          <circle fill="white" cx="16" cy="16" r="16" />
          <path
            fill="black"
            d="M20.078 25.75v-3.186a2.946 2.946 0 0 1-2.502-2.908v-7.312a2.946 2.946 0 0 1 2.502-2.908V6.25a6.14 6.14 0 0 0-4.084 2.01 6.187 6.187 0 0 0-4.084-2.01v3.186a2.946 2.946 0 0 1 2.502 2.908v7.312a2.946 2.946 0 0 1-2.502 2.908v3.186a6.14 6.14 0 0 0 4.084-2.01 6.187 6.187 0 0 0 4.084 2.01Z"
          />
        </svg>
        <FormGroup>
          {/* docker */}
          <FormControlLabel
            onChange={handleChange}
            control={
              <Checkbox
                sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                className="p-0"
              />
            }
            className="text-white text-sm gap-2 ml-0"
            label="Docker is installed and running"
          />
          {!isDockerStart && (
            <a
              href="https://www.docker.com/products/docker-desktop"
              target="_blank"
              className="bg-white text-sm normal-case font-medium inline-flex justify-center items-center py-3 px-16 mt-4 rounded-3xl transition-all hover:brightness-90"
              rel="noreferrer"
            >
              Install Docker
            </a>
          )}

          <button
            type="button"
            disabled={!isDockerStart}
            onClick={onInstall}
            className="text-white border-2 border-neutral-50 text-sm normal-case font-medium inline-flex justify-center items-center py-3 px-16 mt-4 rounded-3xl transition-all enabled:hover:brightness-90 disabled:opacity-30"
          >
            <div>
              {isLoading && (
                <div className="flex items-center">
                  <CircularProgress size={20} color="inherit" />
                  <span className="ml-8">Installing...</span>
                </div>
              )}
              {!isLoading && 'Install Initia'}
            </div>
          </button>
          {isLoading && (
            <h3 className="text-sm text-white font-normal mt-4 ml-3.5">
              This may take a few minutes.
            </h3>
          )}
        </FormGroup>
      </div>
    </div>
  )
}

export default LandingPage
