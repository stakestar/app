import { useSelector } from '~/features/core'

import { StakingState, selectTotalTVL } from '../store'

export function useTotalTvl(): StakingState['totalTvl'] {
  return useSelector(selectTotalTVL)
}
