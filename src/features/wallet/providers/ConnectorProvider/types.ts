import { IconName } from '@onestaree/ui-kit'
import { MetaMask } from '@rromanovsky/web3-react-metamask'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { Web3ReactHooks } from '@web3-react/core'
import { Network } from '@web3-react/network'
import { WalletConnect } from '@web3-react/walletconnect'

export type WalletConnectorId = 'metaMask' | 'coinbaseWallet' | 'walletConnect'

export type WalletConnector = {
  id: WalletConnectorId
  name: string
  icon: IconName
  connector: MetaMask | CoinbaseWallet | WalletConnect
  hooks: Web3ReactHooks
}

export type NetworkConnector = {
  id: 'network'
  connector: Network
  hooks: Web3ReactHooks
}

export type Connector = WalletConnector | NetworkConnector
export type ConnectorId = WalletConnector['id'] | NetworkConnector['id']
