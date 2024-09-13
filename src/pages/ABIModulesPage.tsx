import { useContext, useState } from 'react'
import { InitiaContextProvider } from '../components/InitiaContextProvider'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  CircularProgress,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { ABIModulesView } from '../components'
import { ABIModuleItem } from '../components'
import { countFunctions, groupFunctionsByMethod, handleResponseModules } from '../data/abi'
import { equals } from 'ramda'

const ABIModulesPage = () => {
  const [selectedFunction, setSelectedFunction] = useState<ABIFunction | null>(null)
  const initia = useContext(InitiaContextProvider)
  if (!initia) return null

  const { data, isLoading, error } = useQuery({
    queryKey: ['move.modules', '0x1'],
    queryFn: async () => {
      const [modules] = await initia.move.modules('0x1')
      return handleResponseModules(modules)
    },
    staleTime: Infinity,
    retry: false
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error instanceof Error) {
    console.error(error.message)
  }

  if (!data || data.length === 0) {
    return (
      <Box className="w-full pl-4 mt-6">
        <Typography variant="h6">NO MODULES FOUND</Typography>
      </Box>
    )
  }

  const renderItem = (abiFunction: ABIFunction) => {
    const isActive = equals(abiFunction, selectedFunction)
    const select = () => setSelectedFunction(abiFunction)
    return (
      <ABIModuleItem
        {...abiFunction}
        isActive={isActive}
        onClick={select}
        key={abiFunction.functionName}
      />
    )
  }

  const renderList = (abiModule: ABIModule) => {
    const { name, functions } = abiModule
    const { view = [], execute = [] } = groupFunctionsByMethod(functions)
    const count = countFunctions(abiModule)

    return (
      <Accordion
        key={name}
        sx={{
          marginBottom: 1,
          backgroundColor: '#f9f9f9',
          '&:hover': { backgroundColor: 'transparent' }
        }}
      >
        <AccordionSummary expandIcon={<MdKeyboardArrowDown />}>
          <Typography variant="body2">
            {name} ({count})
          </Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ maxHeight: '500px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}
        >
          <Stack spacing={2}>
            {view.map(renderItem)}
            {execute.map(renderItem)}
          </Stack>
        </AccordionDetails>
      </Accordion>
    )
  }

  return (
    <Box
      sx={{ maxHeight: '95%' }}
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      height="100vh"
      overflow="hidden"
    >
      {/* Left Side: List of Modules */}
      <Box sx={{ flex: '1 1 50%', overflowY: 'auto', padding: 3 }}>{data.map(renderList)}</Box>

      {/* Right Side: Module View */}
      <Box sx={{ flex: '1 1 50%', overflowY: 'auto', padding: 3 }}>
        {selectedFunction ? (
          <ABIModulesView abiFunction={selectedFunction} />
        ) : (
          <Typography>Select a function to view details</Typography>
        )}
      </Box>
    </Box>
  )
}

export default ABIModulesPage
