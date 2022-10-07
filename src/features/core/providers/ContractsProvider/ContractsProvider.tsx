import {
  ADDRESSES,
  Network,
  StakeStar,
  StakeStarETH,
  StakeStarETH__factory,
  StakeStarRegistry,
  StakeStarRegistry__factory,
  StakeStar__factory
} from '@stakestar/contracts'
import { PropsWithChildren, createContext, useMemo } from 'react'

import { APP_EVENT_CONTRACTS_READY } from '../../constants'
import { emitEvent, handleError } from '../../utils'
import { useSignerOrProvider } from './useSignerOrProvider'

export type ContractsProviderValue = {
  stakeStarContract: StakeStar
  stakeStarEthContract: StakeStarETH
  stakeStarRegistryContract: StakeStarRegistry
}

export const ContractsProviderContext = createContext({} as ContractsProviderValue)

export function ContractsProvider({ children }: PropsWithChildren): JSX.Element {
  const signerOrProvider = useSignerOrProvider()

  const value = useMemo((): ContractsProviderValue => {
    const initialValue = {} as ContractsProviderValue

    if (!signerOrProvider) {
      return initialValue
    }

    try {
      const { stakeStar, stakeStarETH, stakeStarRegistry } = ADDRESSES[Network.GOERLI]

      return {
        stakeStarContract: StakeStar__factory.connect(stakeStar, signerOrProvider),
        stakeStarEthContract: StakeStarETH__factory.connect(stakeStarETH, signerOrProvider),
        stakeStarRegistryContract: StakeStarRegistry__factory.connect(stakeStarRegistry, signerOrProvider)
      }
    } catch (error) {
      handleError(error, { displayGenericMessage: true })

      return initialValue
    }
  }, [signerOrProvider])

  if (Object.keys(value).length) {
    emitEvent(APP_EVENT_CONTRACTS_READY)
  }

  return <ContractsProviderContext.Provider value={value}>{children}</ContractsProviderContext.Provider>
}
