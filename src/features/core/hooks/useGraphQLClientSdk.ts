import { Sdk } from '@stakestar/subgraph-client'
import { useMemo } from 'react'

import { useChainConfig } from '~/features/wallet'

import { getGraphQLClientSdk } from '../utils/graphQLClient'

export function useGraphQLClientSdk(): Sdk {
  const chainConfig = useChainConfig()

  return useMemo(() => {
    return getGraphQLClientSdk(chainConfig.gpaphQlUrl)
  }, [chainConfig])
}
