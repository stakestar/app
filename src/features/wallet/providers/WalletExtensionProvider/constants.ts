import {
  coinbaseWalletConnector,
  coinbaseWalletConnectorHooks,
  emptyConnector,
  emptyConnectorHooks,
  metaMaskConnector,
  metaMaskConnectorHooks,
  walletConnectConnector,
  walletConnectConnectorHooks
} from './connectors'
import { WalletExtension } from './types'

export const walletsExtensions: WalletExtension[] = [
  {
    id: 'metaMask',
    name: 'MetaMask',
    icon: 'walletMetamask',
    connector: metaMaskConnector,
    hooks: metaMaskConnectorHooks
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    icon: 'walletCoinbaseWallet',
    connector: coinbaseWalletConnector,
    hooks: coinbaseWalletConnectorHooks
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    icon: 'walletWalletConnect',
    connector: walletConnectConnector,
    hooks: walletConnectConnectorHooks
  }
]

export const emptyWalletExtension = {
  id: null,
  name: null,
  icon: 'empty',
  connector: emptyConnector,
  hooks: emptyConnectorHooks
} as const
