import { PropsWithChildren, createContext } from 'react'
import { useMemo } from 'react'

import { useLocalStorage } from '~/features/core'

import { walletsExtensions } from './constants'
import { EmptyWalletExtension, WalletExtension, WalletExtensionId } from './types'
import { useSyncAccount } from './useSyncAccount'
import { getWalletExtensionByWalletExtensionId } from './utils'

export type WalletExtensionProviderValue = {
  connect: (walletExtensionId: WalletExtensionId) => void
  disconnect: () => void
  walletExtension: WalletExtension | EmptyWalletExtension
  walletsExtensions: WalletExtension[]
}

export const WalletExtensionProviderContext = createContext<WalletExtensionProviderValue>(
  {} as WalletExtensionProviderValue
)

export function WalletExtensionProvider({ children }: PropsWithChildren): JSX.Element {
  const [walletExtensionId, setWalletExtensionId] = useLocalStorage<WalletExtensionId | null>('wallet', null)
  const walletExtension = getWalletExtensionByWalletExtensionId(walletExtensionId)

  const value = useMemo(
    (): WalletExtensionProviderValue => ({
      connect: (newWalletExtensionId): void => setWalletExtensionId(newWalletExtensionId),
      disconnect: (): void => setWalletExtensionId(null),
      walletExtension,
      walletsExtensions
    }),
    [walletExtension, setWalletExtensionId]
  )

  useSyncAccount({
    walletExtensionId,
    web3ReactHooks: walletExtension.hooks
  })

  return <WalletExtensionProviderContext.Provider value={value}>{children}</WalletExtensionProviderContext.Provider>
}
