import { ChainId, Token, TokenId } from '../types'

export const getDefaultChainId = (): ChainId => {
  const host = window.location.host

  if (host === 'app.stakestar.io') {
    return ChainId.Mainnet
  } else {
    return ChainId.Goerli
  }
}

export const chainIdLocalSorageKey = 'chainId'

type Tokens = Record<TokenId, Token>

export const tokens: Tokens = {
  ETH: {
    title: 'ETH',
    id: 'ETH',
    decimals: 18,
    address: '',
    icon1: 'tokenEth'
  },
  sstarETH: {
    title: 'sstarETH',
    id: 'sstarETH',
    decimals: 18,
    address: '',
    icon1: 'tokenEth'
  }
}

export type ChainConfig = {
  name: string
  explorer: string
  urls: string[]
  tokens: Tokens
  gpaphQlUrl: string
  ssvApiUrL: string
}

export const chainConfigs: Record<ChainId, ChainConfig> = {
  [ChainId.Mainnet]: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    urls: [`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`],
    tokens,
    gpaphQlUrl: 'https://subgraph.stakestar.io/subgraphs/name/stakestar',
    ssvApiUrL: 'https://api.ssv.network/api/v4/mainnet/'
  },
  [ChainId.Goerli]: {
    name: 'Görli',
    explorer: 'https://goerli.etherscan.io',
    urls: [`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`],
    tokens,
    gpaphQlUrl: 'https://subgraph.stakestar.io/subgraphs/name/stakestar-testnet',
    ssvApiUrL: 'https://api.ssv.network/api/v4/prater/'
  }
}
