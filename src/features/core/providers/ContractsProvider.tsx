import { StakeStar, StakeStarRegistry, StakeStarRegistry__factory, StakeStar__factory } from '@stakestar/contracts'
import { PropsWithChildren, createContext, useMemo } from 'react'

import { useChainConfig, useConnector } from '~/features/wallet'

export type ContractsProviderValue = {
  stakeStarContract: StakeStar
  stakeStarRegistry: StakeStarRegistry
}

export const ContractsProviderContext = createContext({} as ContractsProviderValue)

export function ContractsProvider({ children }: PropsWithChildren): JSX.Element {
  const { contractsAddresses } = useChainConfig()
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()

  const value = useMemo((): ContractsProviderValue => {
    if (!provider) {
      return {} as ContractsProviderValue
    }

    const signerOrProvider = provider?.getSigner?.() || provider

    return {
      stakeStarContract: StakeStar__factory.connect(contractsAddresses.stakeStar, signerOrProvider),
      stakeStarRegistry: StakeStarRegistry__factory.connect(contractsAddresses.stakeStarRegistry, signerOrProvider)
    }
  }, [contractsAddresses, provider])

  return <ContractsProviderContext.Provider value={value}>{children}</ContractsProviderContext.Provider>
}
