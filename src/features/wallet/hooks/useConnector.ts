import { useContext } from 'react'

import { ConnectorProviderContext, ConnectorProviderValue } from '../providers/ConnectorProvider'

export function useConnector(): ConnectorProviderValue {
  return useContext(ConnectorProviderContext)
}
