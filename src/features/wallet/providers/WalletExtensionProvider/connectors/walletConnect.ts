import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'

import { ChainId, supportedChains } from '~/features/core'

export const [walletConnectConnector, walletConnectConnectorHooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        rpc: {
          [ChainId.Mainnet]: supportedChains[ChainId.Mainnet].urls,
          [ChainId.Goerli]: supportedChains[ChainId.Goerli].urls
        }
      }
    })
)
