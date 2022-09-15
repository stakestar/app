import { BigNumber as BigNumberJs } from 'bignumber.js'
import { gql, request } from 'graphql-request'
import { useCallback, useEffect, useState } from 'react'

import { handleError } from '~/features/core'

const url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

const query = gql`
  {
    bundles {
      ethPriceUSD
    }
  }
`

type QueryResult = {
  bundles: { ethPriceUSD: string }[]
}

export function useEthPriceUsd(): {
  ethPriceUsd: BigNumberJs
  ethToUsd: (ethWei: string) => BigNumberJs
} {
  const [ethPriceUsd, setEthPriceUsd] = useState(new BigNumberJs(0))
  const ethToUsd = useCallback((ethWei: string) => convertEthToUsd(ethWei, ethPriceUsd), [ethPriceUsd])

  useEffect(() => {
    request<QueryResult>(url, query)
      .then(({ bundles }) => {
        if (bundles.length) {
          setEthPriceUsd(new BigNumberJs(bundles[0].ethPriceUSD))
        }
      })
      .catch(handleError)
  }, [])

  return { ethPriceUsd, ethToUsd }
}

function convertEthToUsd(ethWei: string, priceUsd: BigNumberJs): BigNumberJs {
  if (ethWei === '0' || priceUsd.isEqualTo(0)) {
    return new BigNumberJs(0)
  }

  const ethBigNumber = new BigNumberJs(ethWei).shiftedBy(-18)
  const priceUsdBigNumber = new BigNumberJs(priceUsd)

  return ethBigNumber.multipliedBy(priceUsdBigNumber)
}
