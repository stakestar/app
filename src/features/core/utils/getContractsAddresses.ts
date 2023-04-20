import { ADDRESSES, Network } from '@stakestar/contracts'

import { getChainNameId } from '~/features/core'

export function getContractsAddresses(): (typeof ADDRESSES)[Network] {
  return ADDRESSES[getChainNameId()]
}
