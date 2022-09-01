import { initializeConnector } from '@web3-react/core'
import { EMPTY, Empty } from '@web3-react/empty'

export const [emptyConnector, emptyConnectorHooks] = initializeConnector<Empty>(() => EMPTY)
