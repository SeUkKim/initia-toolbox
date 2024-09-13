import { AccAddress, LCDClient } from '@initia/initia.js'
import { serializeArg } from './args'

class RequestController {
  abiFunction: ABIFunction
  formValues: FormValues
  lcd: LCDClient
  address?: string

  constructor(abiFunction: ABIFunction, formValues: FormValues, lcd: LCDClient, address?: string) {
    this.abiFunction = abiFunction
    this.formValues = formValues
    this.lcd = lcd
    this.address = address
  }

  get params() {
    const { typeArgs, args } = this.formValues
    return [
      this.abiFunction.moduleAddress,
      this.abiFunction.moduleName,
      this.abiFunction.functionName,
      typeArgs.map(({ value }) => value),
      args.map(({ value }, index) =>
        serializeArg({ type: this.abiFunction.argsTypes[index], value })
      )
    ] as const
  }

  get curl() {
    if (this.abiFunction.method !== 'view') return undefined
    const [address, moduleName, functionName, typeArgs, args] = this.params
    const moduleAddress = address.startsWith('0x') ? AccAddress.fromHex(address) : address
    const path = `accounts/${moduleAddress}/modules/${moduleName}/view_functions/${functionName}`
    return `curl '${this.lcd.URL}/initia/move/v1/${path}' \\
--data-raw '{"type_args":[${typeArgs.map(renderString).join()}],"args":[${args.map(renderString).join()}]}'`
  }

  get js() {
    const fn = { view: 'lcd.move.viewFunction', execute: 'new MsgExecute' }[this.abiFunction.method]
    const [moduleAddress, moduleName, functionName, typeArgs, args] = this.params

    const render = [
      this.abiFunction.method !== 'execute' ? '' : this.address ? `"${this.address}"` : 'address',
      renderString(moduleAddress),
      renderString(moduleName),
      renderString(functionName),
      renderArray(typeArgs.map(renderString), !!args.length),
      renderArray(args.map(renderString))
    ]

    return `${fn}(\n  ${render.filter(Boolean).join(`,\n  `)}\n)`
  }
}

export default RequestController

/* utils */
const renderString = (value: string) => {
  return `"${value}"`
}

const renderArray = (value: string[], required?: boolean) => {
  if (!value.length) return required ? 'undefined' : undefined
  return `[${value.join(', ')}]`
}
