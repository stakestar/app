import { BigNumber as BigNumberJs } from 'bignumber.js'
import { useCallback } from 'react'

import { useSelector } from '~/features/core'

import { selectSsEthPriceUSD } from '../store'
import { convertEthToUsd } from '../utils'

export function useConvertSsEthToUsd(): (ethWei: string) => BigNumberJs {
  const ssEthPriceUSD = useSelector(selectSsEthPriceUSD)

  return useCallback((ethWei) => convertEthToUsd(ethWei, ssEthPriceUSD), [ssEthPriceUSD])
}
