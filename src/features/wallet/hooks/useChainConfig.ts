import { useMemo } from 'react'

import {
  ChainConfig,
  ChainId,
  chainConfigs,
  chainIdLocalSorageKey,
  getDefaultChainId,
  useLocalStorage
} from '~/features/core'

export function useChainConfig(): ChainConfig {
  const [chainId] = useLocalStorage<ChainId>(chainIdLocalSorageKey, getDefaultChainId())

  return useMemo(() => {
    return chainConfigs[chainId]
  }, [chainId])
}
