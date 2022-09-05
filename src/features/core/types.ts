import { IconName } from '@onestaree/ui-kit'

export enum ChainId {
  Mainnet = 1,
  Goerli = 5
}

export type TokenId = 'ETH' | 'stETH'

export type Token = {
  title: string
  id: TokenId
  decimals: number
  address: string
  icon1: IconName
  icon2?: IconName
}
