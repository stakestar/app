import { OPERATOR_IDS } from '@stakestar/contracts'

import { getChainNameId } from './getChainNameId'

export function getOperatorsIds(): string[] {
  return OPERATOR_IDS[getChainNameId()].map((operatorId) => operatorId.toString())
}
