interface ABIModule {
  address: string
  name: string
  functions: ABIFunction[]
}

interface ABIFunction {
  method: 'view' | 'execute'
  moduleAddress: string
  moduleName: string
  functionName: string
  typeArgsLength: number
  argsTypes: string[]
}

/* response */
interface ResponseModules {
  modules: ResponseModule[]
  pagination: Pagination
}

interface Pagination {
  next_key: null
  total: string
}

interface ResponseModule {
  address: string
  module_name: string
  abi: string
}

interface ResponseABI {
  address: string
  name: string
  friends: string[]
  exposed_functions: ExposedFunction[]
  structs: Struct[]
}

interface ExposedFunction {
  name: string
  visibility: 'public' | 'friend'
  is_view: boolean
  is_entry: boolean
  generic_type_params: GenericTypeParam[]
  params: string[]
  return: string[]
}

interface Struct {
  name: string
  is_native: boolean
  abilities: string[]
  generic_type_params: GenericTypeParam[]
  fields: Field[]
}

interface GenericTypeParam {
  constraints: string[]
}

interface Field {
  name: string
  type: string
}
