import { chainConfigs, chainIdLocalSorageKey, getDefaultChainId } from '../config'
import { getLocalStorageItem } from '../utils'

export function getExplorerUrl(path: 'address' | 'tx', hash: string): string {
  const chainId = getLocalStorageItem(chainIdLocalSorageKey, getDefaultChainId())

  return `${chainConfigs[chainId].explorer}/${path}/${hash}`
}
