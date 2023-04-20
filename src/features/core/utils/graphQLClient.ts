import { Sdk, getSdk } from '@stakestar/subgraph-client'
import { GraphQLClient } from 'graphql-request'

export const getGraphQLClientSdk = (url: string): Sdk => {
  const client = new GraphQLClient(url)

  return getSdk(client)
}
