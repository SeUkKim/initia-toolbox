import { AccAddress, bcs } from '@initia/initia.js'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'

export const getArgType = (argType: string) => {
  if (argType.startsWith('0x1::object::Object<')) return 'object'
  return argType
    .replaceAll('0x1::string::String', 'string')
    .replaceAll('0x1::option::Option', 'option')
    .replaceAll('0x1::decimal128::Decimal128', 'decimal128')
    .replaceAll('0x1::decimal256::Decimal256', 'decimal256')
}

export const getArgValue = ({ type, value }: { type: string; value: string }) => {
  try {
    if (type === 'bool') return JSON.parse(value)
    if (value === 'null') return null
    if (type.startsWith('vector')) return JSON.parse(value) as string[]
    return value
  } catch {
    return ''
  }
}

const parseTypes = (type: string): any => {
  if (type.startsWith('option')) {
    const trimOption = type.replace('option<', '').slice(0, -1)
    return bcs.option(parseTypes(trimOption))
  }
  if (type.startsWith('vector')) {
    const trimVector = type.replace('vector<', '').slice(0, -1)
    return bcs.vector(parseTypes(trimVector))
  }
  switch (type) {
    case 'address':
      return bcs.address()
    case 'string':
      return bcs.string()
    case 'object':
      return bcs.object()
    case 'decimal128':
      return bcs.decimal128()
    case 'decimal256':
      return bcs.decimal256()
    case 'u8':
      return bcs.u8()
    case 'u16':
      return bcs.u16()
    case 'u32':
      return bcs.u32()
    case 'u64':
      return bcs.u64()
    case 'u128':
      return bcs.u128()
    case 'u256':
      return bcs.u256()
    case 'bool':
      return bcs.bool()
  }
}

export const serializeArg = (arg: { type: string; value: string }) => {
  try {
    const argType = getArgType(arg.type)
    const argValue = getArgValue(arg)
    return parseTypes(argType).serialize(argValue).toBase64()
  } catch {
    return ''
  }
}

export const getPlaceholder = (type: string, address = ''): string => {
  try {
    const argType = getArgType(type)
    if (argType === 'address' && address) return AccAddress.toHex(address)
    if (argType === 'u64') return '1000000'
    if (argType.startsWith('option')) return 'null'
    if (argType.startsWith('vector')) return `[${getPlaceholder(argType.split(/<(.*)>/)[1])}]`
    return ''
  } catch {
    return ''
  }
}

export const getId = customAlphabet(alphanumeric, 6)
