import { BigNumber as BigNumberJs } from 'bignumber.js'
import { useCallback } from 'react'

import { useSelector } from '~/features/core'

import { selectEthPriceUSD } from '../store'
import { convertEthToUsd } from '../utils'

export function useConvertEthToUsd(): (ethWei: string) => BigNumberJs {
  const ethPriceUSD = useSelector(selectEthPriceUSD)

  return useCallback((ethWei) => convertEthToUsd(ethWei, ethPriceUSD), [ethPriceUSD])
}
