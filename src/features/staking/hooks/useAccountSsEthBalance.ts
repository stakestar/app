import { TokenAmount, useSelector } from '~/features/core'

import { selectAccauntSsEthBalance } from '../store'

export function useAccountSsEthBalance(): TokenAmount {
  return useSelector(selectAccauntSsEthBalance)
}
