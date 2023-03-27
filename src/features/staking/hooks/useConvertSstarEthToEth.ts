import { useCallback } from 'react'

import { TokenAmount } from '~/features/core'

import { convertSstarEthToEth } from '../utils/converter'
import { useSstarEthToEthRate } from './useSstarEthToEthRate'

export function useConvertSstarEthToEth(): (sstarEthWei: string) => TokenAmount {
  const sstarEthToEthRate = useSstarEthToEthRate()

  return useCallback(
    (sstarEthWei: string) =>
      TokenAmount.fromWei('ETH', convertSstarEthToEth(sstarEthWei, sstarEthToEthRate).toString()),
    [sstarEthToEthRate]
  )
}
