import { gql, request } from 'graphql-request'

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

export function loadEthPriceUsd(): Promise<string> {
  return request<QueryResult>(url, query).then(({ bundles }) => bundles[0].ethPriceUSD)
}
