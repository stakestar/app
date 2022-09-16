import { Provider } from '@ethersproject/providers'
import { Signer } from 'ethers'
import { useMemo, useRef } from 'react'

import { useConnector } from '~/features/wallet'

export function useSignerOrProvider(): Signer | Provider | undefined {
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()
  const providerCache = useRef(provider)

  return useMemo(() => {
    if (provider) {
      providerCache.current = provider
    }

    const providerCached = providerCache.current

    return providerCached?.provider ? (providerCached.getSigner() as Signer) : (providerCached as unknown as Provider)
  }, [provider])
}
