import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'
import { useMemo } from 'react'

import { ChainId, appName, chainConfigs } from '~/features/core'

import { Connector } from './types'

export function useConnectors(chainId: ChainId): Connector[] {
  const chainConfig = chainConfigs[chainId]

  const [web3ReactMetaMaskConnector, web3ReactMetaMaskHooks] = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions })
  )

  const [web3ReactCoinbaseWalletConnector, web3ReactCoinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          appName,
          url: chainConfig.urls[0]
        }
      })
  )

  const [web3ReactWalletConnectConnector, web3ReactWalletConnectHooks] = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: {
            [ChainId.Mainnet]: chainConfigs[ChainId.Mainnet].urls,
            [ChainId.Goerli]: chainConfigs[ChainId.Goerli].urls
          }
        }
      })
  )

  const [web3ReactNetworkConnector, web3ReactNetworkHooks] = initializeConnector<Network>(
    (actions) =>
      new Network({
        actions,
        urlMap: Object.keys(chainConfigs).reduce((result, ItemChainId) => {
          const key = ItemChainId as unknown as ChainId

          result[key] = chainConfigs[key].urls

          return result
        }, {} as Record<ChainId, string[]>),
        // TODO
        defaultChainId: ChainId.Goerli
      })
  )

  return useMemo(
    () => [
      {
        id: 'metaMask',
        name: 'MetaMask',
        icon: 'walletMetamask',
        connector: web3ReactMetaMaskConnector,
        hooks: web3ReactMetaMaskHooks
      },
      {
        id: 'coinbaseWallet',
        name: 'Coinbase Wallet',
        icon: 'walletCoinbaseWallet',
        connector: web3ReactCoinbaseWalletConnector,
        hooks: web3ReactCoinbaseWalletHooks
      },
      {
        id: 'walletConnect',
        name: 'WalletConnect',
        icon: 'walletWalletConnect',
        connector: web3ReactWalletConnectConnector,
        hooks: web3ReactWalletConnectHooks
      },
      {
        id: 'network',
        connector: web3ReactNetworkConnector,
        hooks: web3ReactNetworkHooks
      }
    ],
    [
      web3ReactCoinbaseWalletConnector,
      web3ReactCoinbaseWalletHooks,
      web3ReactMetaMaskConnector,
      web3ReactMetaMaskHooks,
      web3ReactNetworkConnector,
      web3ReactNetworkHooks,
      web3ReactWalletConnectConnector,
      web3ReactWalletConnectHooks
    ]
  )
}
