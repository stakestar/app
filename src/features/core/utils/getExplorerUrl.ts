import { chainIdLocalSorageKey, defaultChainId, getLocalStorageItem } from '~/features/core'

import { chainConfigs } from '../config'

export function getExplorerUrl(path: 'address' | 'tx', hash: string): string {
  const chainId = getLocalStorageItem(chainIdLocalSorageKey, defaultChainId)

  return `${chainConfigs[chainId].explorer}/${path}/${hash}`
}
