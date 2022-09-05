import { TokenAmount, TokenId, useSelector } from '~/features/core'

import { selectAccauntBalance } from '../store'

export function useAccountBalance(tokenId: TokenId): TokenAmount {
  return useSelector((state) => selectAccauntBalance(state, tokenId))
}
