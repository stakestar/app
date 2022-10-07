import { ChainId, Token, TokenId } from '../types'

export const defaultChainId = ChainId.Goerli
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
  ssETH: {
    title: 'ssETH',
    id: 'ssETH',
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
}

export const chainConfigs: Record<ChainId, ChainConfig> = {
  [ChainId.Mainnet]: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    urls: [`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`],
    tokens
  },
  [ChainId.Goerli]: {
    name: 'Görli',
    explorer: 'https://goerli.etherscan.io',
    urls: [`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`],
    tokens
  }
}
