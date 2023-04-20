import { useSelector } from '~/features/core'

import { StakingState, selectLocalPool } from '../store'

export function useLocalPool(): StakingState['localPool'] {
  return useSelector(selectLocalPool)
}
