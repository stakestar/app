import { MetaMask } from '@rromanovsky/web3-react-metamask'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import type { Connector } from '@web3-react/types'
import { WalletConnect } from '@web3-react/walletconnect'

import { getDefaultChainId } from '~/features/core'

export function getWalletName(connector: Connector): string {
  return connector instanceof MetaMask
    ? 'MetaMask'
    : connector instanceof CoinbaseWallet
    ? 'Coinbase Wallet'
    : connector instanceof WalletConnect
    ? 'WalletConnect'
    : 'Unknown'
}

export function cropWalletAddress(address: string | undefined, tailsSize = 4): string | null {
  if (!address) {
    return null
  }

  return `${address.slice(0, tailsSize + 1)}...${address.slice(-tailsSize)}`
}

export function isChainIdSupported(chainId?: number): boolean {
  return !!chainId && chainId === getDefaultChainId()
}
