import { useContext } from 'react'

import { WalletExtensionProviderContext, WalletExtensionProviderValue } from '../providers/WalletExtensionProvider'

export function useWalletExtension(): WalletExtensionProviderValue {
  return useContext(WalletExtensionProviderContext)
}
