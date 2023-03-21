import { gql, request } from 'graphql-request'

import { uniswapThegraphUrl } from '~/features/core'

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

export function loadEthPriceUsd(): Promise<string> {
  return request<QueryResult>(uniswapThegraphUrl, query).then(({ bundles }) => bundles[0].ethPriceUSD)
}
