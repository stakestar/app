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
    icon1: 'tokenEthereum'
  },
  stETH: {
    title: 'stETH',
    id: 'stETH',
    decimals: 18,
    address: '',
    icon1: 'tokenEthereum'
  }
}

export type ChainConfig = {
  name: string
  explorer: string
  urls: string[]
  contractsAddresses: {
    stakeStar: string
    stakeStarRegistry: string
  }
  tokens: Tokens
}

export const chainConfigs: Record<ChainId, ChainConfig> = {
  [ChainId.Mainnet]: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    urls: [`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`],
    contractsAddresses: {
      stakeStar: '',
      stakeStarRegistry: ''
    },
    tokens
  },
  [ChainId.Goerli]: {
    name: 'Görli',
    explorer: 'https://goerli.etherscan.io',
    urls: [`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`],
    contractsAddresses: {
      stakeStar: '0x8109a33A617fB5D4D9934009F3d7520348e7E33e',
      stakeStarRegistry: '0x41082E8dCEb5eDda19206feD05B0033AeEe7fE76'
    },
    tokens
  }
}
