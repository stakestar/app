import { Network } from '@stakestar/contracts'

import { getDefaultChainId } from '../config'
import { ChainId } from '../types'
import { getChainId } from './getChainId'

const chainIdsMap: Record<ChainId, Network> = {
  [ChainId.Mainnet]: Network.MAINNET,
  [ChainId.Goerli]: Network.GOERLI
}

export function getChainNameId(): Network {
  return chainIdsMap[getChainId()] || chainIdsMap[getDefaultChainId()]
}
