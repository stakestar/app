import { IconName } from '@onestaree/ui-kit'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactHooks } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'

import { emptyWalletExtension } from './constants'

export type WalletExtensionId = 'metaMask' | 'coinbaseWallet' | 'walletConnect'

export type WalletExtension = {
  id: WalletExtensionId
  name: string
  icon: IconName
  connector: CoinbaseWallet | MetaMask | WalletConnect
  hooks: Web3ReactHooks
}

export type EmptyWalletExtension = typeof emptyWalletExtension
