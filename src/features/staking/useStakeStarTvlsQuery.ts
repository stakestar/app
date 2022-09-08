import { useQuery } from 'graphql-hooks'

import { useChainConfig } from '~/features/wallet'

const query = `query StakeStarTvls($id: ID!) {
  stakeStarTvls(id: $id) {
    id
    totalETH
  }
}`

export function useStakeStarTvlsQuery(): ReturnType<typeof useQuery> {
  const { contractsAddresses } = useChainConfig()

  return useQuery(query, {
    variables: {
      id: contractsAddresses.stakeStar
    }
  })
}
