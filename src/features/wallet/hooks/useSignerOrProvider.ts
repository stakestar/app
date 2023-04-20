import { Provider } from '@ethersproject/providers'
import { Signer } from 'ethers'
import { useMemo, useRef } from 'react'

import { useConnector } from './useConnector'

export function useSignerOrProvider(): Signer | Provider | undefined {
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()
  const providerCached = useRef(provider)

  return useMemo(() => {
    if (provider) {
      providerCached.current = provider
    }

    const { current } = providerCached

    return current?.provider ? (current.getSigner() as Signer) : (current as unknown as Provider)
  }, [provider])
}
