import { PropsWithChildren, createContext, useMemo } from 'react'

import { ChainId, chainIdLocalSorageKey, getDefaultChainId, useLocalStorage } from '~/features/core'

import { Connector, ConnectorId } from './types'
import { useConnectors } from './useConnectors'
import { useSyncAccount } from './useSyncAccount'
import { getConnector } from './utils'

export type ConnectorProviderValue = {
  connector: Connector
  connectors: Connector[]
  connect: (connectorId: ConnectorId) => void
  disconnect: () => void
  setChainId: (chainId: ChainId) => void
}

export const ConnectorProviderContext = createContext<ConnectorProviderValue>({} as ConnectorProviderValue)

export function ConnectorProvider({ children }: PropsWithChildren): JSX.Element {
  const defaultConnectorId: ConnectorId = 'network'
  const [connectorId, setConnectorId] = useLocalStorage<ConnectorId>('connectorId', defaultConnectorId)
  const [chainId, setChainId] = useLocalStorage<ChainId>(chainIdLocalSorageKey, getDefaultChainId())
  const connectors = useConnectors(chainId)
  const connector = getConnector(connectors, connectorId)

  const value = useMemo(
    (): ConnectorProviderValue => ({
      connector,
      connectors,
      connect: (newConnectorId): void => setConnectorId(newConnectorId),
      disconnect: (): void => setConnectorId(defaultConnectorId),
      setChainId
    }),
    [connector, connectors, setChainId, setConnectorId]
  )

  return (
    <ConnectorProviderContext.Provider value={value}>
      <Listener connectorId={connectorId}>{children}</Listener>
    </ConnectorProviderContext.Provider>
  )
}

interface ListenerProps extends PropsWithChildren {
  connectorId: ConnectorId
}

function Listener({ connectorId, children }: ListenerProps): JSX.Element {
  useSyncAccount(connectorId)

  return <>{children}</>
}
