import { TokenKey, useSelector } from '~/features/core'

import { selectAccauntBalance } from '../store'
import { TokenBalance } from '../types'

export function useAccountBalance(tokenKey: TokenKey): TokenBalance | undefined {
  return useSelector((state) => selectAccauntBalance(state, tokenKey))
}
