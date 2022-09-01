import { emptyWalletExtension, walletsExtensions } from './constants'
import { EmptyWalletExtension, WalletExtension, WalletExtensionId } from './types'

export function getWalletExtensionByWalletExtensionId(
  walletExtensionId: WalletExtensionId | null
): WalletExtension | EmptyWalletExtension {
  return walletsExtensions.find(({ id }) => id === walletExtensionId) || emptyWalletExtension
}
