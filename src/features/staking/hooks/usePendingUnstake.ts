import { TokenAmount, useSelector } from '~/features/core'

import { selectPendingUnstake } from '../store'

export function usePendingUnstake(): TokenAmount {
  return TokenAmount.fromWei('ETH', useSelector(selectPendingUnstake))
}
