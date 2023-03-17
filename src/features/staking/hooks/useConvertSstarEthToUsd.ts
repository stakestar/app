import { BigNumber as BigNumberJs } from 'bignumber.js'
import { useCallback } from 'react'

import { useSelector } from '~/features/core'

import { selectSstarEthPriceUSD } from '../store'
import { convertEthToUsd } from '../utils'

export function useConvertSstarEthToUsd(): (ethWei: string) => BigNumberJs {
  const sstarEthPriceUSD = useSelector(selectSstarEthPriceUSD)

  return useCallback((ethWei) => convertEthToUsd(ethWei, sstarEthPriceUSD), [sstarEthPriceUSD])
}
