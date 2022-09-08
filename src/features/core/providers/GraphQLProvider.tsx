import { ClientContext, GraphQLClient } from 'graphql-hooks'
import { PropsWithChildren } from 'react'

import { graphQLUrl } from '../config'

const client = new GraphQLClient({ url: graphQLUrl })

export function GraphQLProvider({ children }: PropsWithChildren): JSX.Element {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}
