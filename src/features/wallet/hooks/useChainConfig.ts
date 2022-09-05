import {
  ChainConfig,
  ChainId,
  chainConfigs,
  chainIdLocalSorageKey,
  defaultChainId,
  useLocalStorage
} from '~/features/core'

export function useChainConfig(): ChainConfig {
  const [chainId] = useLocalStorage<ChainId>(chainIdLocalSorageKey, defaultChainId)

  return chainConfigs[chainId]
}
