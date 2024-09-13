import { filter, groupBy, map, pipe } from 'ramda'

/* handle response */
const handleResponseFunction = ({ address: moduleAddress, name: moduleName }: ResponseABI) => {
  return ({
    name: functionName,
    generic_type_params,
    params,
    return: returns
  }: ExposedFunction): ABIFunction => {
    const method = returns.length > 0 ? 'view' : 'execute'
    const typeArgsLength = generic_type_params.length
    const argsTypes = method === 'execute' && params[0] === '&signer' ? params.slice(1) : params
    return { moduleAddress, moduleName, functionName, method, typeArgsLength, argsTypes }
  }
}

export const handleResponseModules = pipe<
  [ResponseModule[]],
  ResponseABI[],
  ResponseABI[],
  ABIModule[]
>(
  map((module) => JSON.parse(module.abi)),
  filter<ResponseABI>((abi) => abi.exposed_functions.filter(({ is_entry }) => is_entry).length > 0),
  map((abi) => {
    const { address, name, exposed_functions } = abi
    const functions = exposed_functions
      .filter(({ is_view, is_entry }) => is_view || is_entry)
      .map(handleResponseFunction(abi))

    return { address, name, functions }
  })
)

/* functions */
export const groupFunctionsByMethod = groupBy<ABIFunction, 'view' | 'execute'>((fn) => fn.method)
export const countFunctions = (abiModule: ABIModule) => abiModule.functions.length
