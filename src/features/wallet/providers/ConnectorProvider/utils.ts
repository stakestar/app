import { Connector, ConnectorId } from './types'

export function getConnector(connectors: Connector[], connectorId?: ConnectorId): Connector {
  return connectors.find(({ id }) => connectorId === id) || connectors[connectors.length - 1]
}
