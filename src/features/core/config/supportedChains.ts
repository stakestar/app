import { ChainId } from '../types'

type ChainConfig = {
  name: string
  explorer: string
  urls: string[]
}

export const supportedChains: Record<ChainId, ChainConfig> = {
  [ChainId.Mainnet]: {
    name: 'Mainnet',
    explorer: 'https://etherscan.io',
    urls: [`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`]
  },
  [ChainId.Goerli]: {
    name: 'Görli',
    explorer: 'https://goerli.etherscan.io',
    urls: [`https://goerli.infura.io/v3/${process.env.INFURA_KEY}`]
  }
}
