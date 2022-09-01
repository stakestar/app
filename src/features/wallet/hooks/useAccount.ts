import { useSelector } from '~/features/core'

import { WalletState, selectAccaunt } from '../store'

export function useAccount(): WalletState['account'] {
  return useSelector(selectAccaunt)
}
