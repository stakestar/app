import { chainIdLocalSorageKey, defaultChainId } from '../config'
import { ChainId } from '../types'
import { getLocalStorageItem } from '../utils'

export function getChainId(): ChainId {
  return getLocalStorageItem(chainIdLocalSorageKey, defaultChainId)
}
