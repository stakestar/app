import { useSelector } from '~/features/core'

import { WalletState, selectWallet } from '../store'

export function useWallet(): WalletState {
  return useSelector(selectWallet)
}
