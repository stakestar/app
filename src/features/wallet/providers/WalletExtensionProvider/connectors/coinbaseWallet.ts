import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'

import { ChainId, supportedChains } from '~/features/core'

export const [coinbaseWalletConnector, coinbaseWalletConnectorHooks] = initializeConnector<CoinbaseWallet>(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        // TODO: move it to config
        appName: 'SSV App',
        url: supportedChains[ChainId.Goerli].urls[0]
      }
    })
)
