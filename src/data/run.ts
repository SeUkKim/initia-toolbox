import { LCDClient, MsgExecute, Wallet } from '@initia/initia.js'
import type RequestController from './request'

const run = async (request: RequestController, wallet: Wallet, lcd: LCDClient) => {
  const view = async () => {
    return await lcd.move.viewFunction(...request.params)
  }

  const execute = async () => {
    if (!request.address) throw new Error('Wallet not connected')
    const msg = new MsgExecute(request.address, ...request.params)
    const signedTx = await wallet.createAndSignTx({
      msgs: [msg]
    })

    const broadcastResult = await lcd.tx.broadcast(signedTx)
    console.log(broadcastResult)
    return broadcastResult
  }

  if (request.abiFunction.method === 'view') return view()
  if (request.abiFunction.method === 'execute') return execute()
  return
}

export default run
