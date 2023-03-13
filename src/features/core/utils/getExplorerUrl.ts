import { chainConfigs, chainIdLocalSorageKey, defaultChainId } from '../config'
import { getLocalStorageItem } from '../utils'

export function getExplorerUrl(path: 'address' | 'tx', hash: string): string {
  const chainId = getLocalStorageItem(chainIdLocalSorageKey, defaultChainId)

  return `${chainConfigs[chainId].explorer}/${path}/${hash}`
}
