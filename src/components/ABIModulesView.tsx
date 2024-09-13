import { useEffect, useState } from 'react'
import { useInitia } from '../hooks/InitiaHooks'
import { Box, SelectChangeEvent } from '@mui/material'
import { getId, getPlaceholder } from '../data/args'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import RequestController from '../data/request'
import { useMutation } from '@tanstack/react-query'
import run from '../data/run'
import { uniq } from 'ramda'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { isAxiosError } from 'axios'
import { SelectWallet } from './index'

const ABIModulesView = ({ abiFunction }: { abiFunction: ABIFunction }) => {
  const { method, functionName, typeArgsLength, argsTypes } = abiFunction
  const [selectedWallet, setSelectedWallet] = useState('validator')
  const { initia, wallets } = useInitia()
  const address = wallets[selectedWallet]?.key.accAddress
  const wallet = wallets[selectedWallet]

  const handleWalletChange = (event: SelectChangeEvent) => {
    setSelectedWallet(event.target.value)
  }

  const [prevTypeArgs, setPrevTypeArgs] = useState([
    '0x1::native_uinit::Coin',
    '0x1::native_uusdc::Coin'
  ])

  const defaultValues = {
    typeArgs: Array.from({ length: typeArgsLength }, () => ({ key: getId(), value: '' })),
    args: Array.from({ length: argsTypes.length }, (_, i) => ({
      key: getId(),
      value: getPlaceholder(argsTypes[i], address)
    }))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues,
    resolver: zodResolver(
      z.object({
        typeArgs: z.array(z.object({ value: z.string().min(1) })),
        args: z.array(z.object({ value: z.string().min(1) }))
      })
    )
  })

  const formValues = watch()

  const request = new RequestController(abiFunction, formValues, initia, address)
  const mutation = useMutation({
    mutationFn: () => {
      return run(request, wallet, initia)
    },
    onSuccess: () =>
      setPrevTypeArgs(uniq([...prevTypeArgs, ...formValues.typeArgs.map(({ value }) => value)]))
  })

  const onSubmit = () => {
    mutation.mutate()
  }

  // Effect to reset the mutation state and form when abiFunction changes
  useEffect(() => {
    mutation.reset()
    reset(defaultValues)
  }, [abiFunction, selectedWallet])

  const renderCodes = () => (
    <div className="mb-5">
      {request.curl && (
        <SyntaxHighlighter
          language="bash"
          style={coy}
          customStyle={{ borderRadius: '8px', padding: '15px' }}
        >
          {request.curl}
        </SyntaxHighlighter>
      )}
      <SyntaxHighlighter
        language="javascript"
        style={coy}
        customStyle={{ borderRadius: '8px', padding: '15px' }}
      >
        {request.js}
      </SyntaxHighlighter>
    </div>
  )

  const renderFields = () => {
    if (!typeArgsLength && !argsTypes.length) return null

    return (
      <div className="mb-5">
        {typeArgsLength > 0 && (
          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">Type Args</h3>
            {Array.from({ length: typeArgsLength }).map((_, index) => (
              <div key={index} className="mb-4">
                <label
                  htmlFor={`typeArg-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type Arg {index + 1}
                </label>
                <input
                  id={`typeArg-${index}`}
                  {...register(`typeArgs.${index}.value`)}
                  list="prevTypeArgs"
                  placeholder="Type Arg"
                  className="p-2 border rounded w-full"
                />
                {errors?.typeArgs?.[index]?.value && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>
            ))}
            <datalist id="prevTypeArgs">
              {prevTypeArgs.map((arg) => (
                <option key={arg} value={arg} />
              ))}
            </datalist>
          </div>
        )}

        {argsTypes.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Args</h3>
            {argsTypes.map((type, index) => (
              <div key={index} className="mb-4">
                <label
                  htmlFor={`arg-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {type}
                </label>
                <input
                  id={`arg-${index}`}
                  {...register(`args.${index}.value`)}
                  placeholder={getPlaceholder(type, address)}
                  className="p-2 border rounded w-full"
                />
                {errors?.args?.[index]?.value && (
                  <span className="text-red-500 text-sm">This field is required</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderResult = () => {
    const { data, error } = mutation

    if (isAxiosError(error)) {
      return (
        <SyntaxHighlighter
          language="json"
          style={coy}
          customStyle={{ borderRadius: '8px', padding: '15px' }}
        >
          {JSON.stringify(error.response?.data, null, 2)}
        </SyntaxHighlighter>
      )
    }

    if (error instanceof Error) {
      return <div className="text-red-500 text-base mt-2">{error.message}</div>
    }

    if (method === 'view' && data) {
      return (
        <SyntaxHighlighter
          language="json"
          style={coy}
          customStyle={{ borderRadius: '8px', padding: '15px' }}
        >
          {JSON.stringify(data, null, 2)}
        </SyntaxHighlighter>
      )
    }

    if (method === 'execute' && typeof data === 'string') {
      return (
        <a
          href={`${initia.URL}/tx/${data}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {data}
        </a>
      )
    }

    return null
  }

  return (
    <Box
      sx={{
        maxHeight: '95%',
        overflowY: 'auto',
        padding: '1rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}
    >
      <Box mb={3}>
        <SelectWallet selected={selectedWallet} onWalletChange={handleWalletChange} />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold text-center mb-5">{functionName}</h1>
        {renderCodes()}
        {renderFields()}
        <button
          type="submit"
          disabled={mutation.isPending}
          className={`w-full py-2 px-4 rounded text-white mt-5 ${method === 'view' ? 'bg-blue-700' : 'bg-purple-500'} transition-colors duration-300`}
        >
          {method === 'view' ? 'View' : 'Execute'}
        </button>
        {renderResult()}
      </form>
    </Box>
  )
}

export default ABIModulesView
