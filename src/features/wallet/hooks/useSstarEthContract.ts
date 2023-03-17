import { ERC20, ERC20__factory } from '@stakestar/contracts'
import { useMemo } from 'react'

import { getContractsAddresses } from '~/features/core'

import { useSignerOrProvider } from '../hooks'

export function useSstarEthContract(): ERC20 | undefined {
  const { sstarETH } = getContractsAddresses()
  const signerOrProvider = useSignerOrProvider()

  return useMemo(
    () => (signerOrProvider ? ERC20__factory.connect(sstarETH, signerOrProvider) : undefined),
    [signerOrProvider, sstarETH]
  )
}
