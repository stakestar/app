import { IconName } from '@onestaree/ui-kit'
import { StakeStarTvl } from '@stakestar/subgraph-client/dist/types.d.ts'

export enum ChainId {
  Mainnet = 1,
  Goerli = 5
}

export type TokenId = 'ETH' | 'ssETH'

export type Token = {
  title: string
  id: TokenId
  decimals: number
  address: string
  icon1: IconName
  icon2?: IconName
}

export type DailyTvls = Array<Pick<StakeStarTvl, 'id' | 'totalETH'>>
