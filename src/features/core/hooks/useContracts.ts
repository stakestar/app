import { useContext } from 'react'

import { ContractsProviderContext, ContractsProviderValue } from '../providers/ContractsProvider'

export function useContracts(): ContractsProviderValue {
  return useContext(ContractsProviderContext)
}
