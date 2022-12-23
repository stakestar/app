import { useSelector } from '~/features/core'

import { StakingState, selectSsEthToEthRate } from '../store'

export function useSsEthToEthRate(): StakingState['ssEthToEthRate'] {
  return useSelector(selectSsEthToEthRate)
}
