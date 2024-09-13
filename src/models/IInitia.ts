import { Coins, LCDClient, Wallet } from '@initia/initia.js'

export interface IInitia {
  initia: LCDClient
  wallets: { [key: string]: Wallet }
  getAccounts(): Wallet[]
}

export interface IInitiaAccount extends IInitia {
  getBalance(address: string): Promise<Coins.Data>
}
