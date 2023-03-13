import { OPERATOR_IDS } from '@stakestar/contracts'

import { getChainNameId } from './getChainNameId'

export function getOperatorsIds(): number[] {
  return OPERATOR_IDS[getChainNameId()]
}
