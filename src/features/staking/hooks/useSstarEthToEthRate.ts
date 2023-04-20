import { useSelector } from '~/features/core'

import { StakingState, selectSstarEthToEthRate } from '../store'

export function useSstarEthToEthRate(): StakingState['sstarEthToEthRate'] {
  return useSelector(selectSstarEthToEthRate)
}
