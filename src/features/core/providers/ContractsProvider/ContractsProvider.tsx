import { StakeStar, StakeStarETH, StakeStarETH__factory, StakeStar__factory } from '@stakestar/contracts'
import { PropsWithChildren, createContext, useMemo, useState } from 'react'

import { useChainConfig } from '~/features/wallet'

import { APP_EVENT_CONTRACTS_READY } from '../../constants'
import { emitEvent, handleError } from '../../utils'
import { useSignerOrProvider } from './useSignerOrProvider'

export type ContractsProviderValue = {
  stakeStarContract: StakeStar
  stakeStarEthContract: StakeStarETH
}

export const ContractsProviderContext = createContext({} as ContractsProviderValue)

export function ContractsProvider({ children }: PropsWithChildren): JSX.Element {
  const [stakeStarEthAddress, setStakeStarEthAddress] = useState('')
  const { contractsAddresses } = useChainConfig()
  const signerOrProvider = useSignerOrProvider()

  const value = useMemo((): ContractsProviderValue => {
    const initialValue = {} as ContractsProviderValue

    if (!signerOrProvider) {
      return initialValue
    }

    try {
      const stakeStarContract = StakeStar__factory.connect(contractsAddresses.stakeStar, signerOrProvider)

      Promise.all([stakeStarContract.stakeStarETH()])
        .then(([stakeStarReceipt]) => {
          setStakeStarEthAddress(stakeStarReceipt)
        })
        .catch((error) => handleError(error, { displayGenericMessage: true }))

      return stakeStarEthAddress
        ? {
            stakeStarContract,
            stakeStarEthContract: StakeStarETH__factory.connect(stakeStarEthAddress, signerOrProvider)
          }
        : initialValue
    } catch (error) {
      handleError(error, { displayGenericMessage: true })

      return initialValue
    }
  }, [contractsAddresses, signerOrProvider, stakeStarEthAddress])

  if (Object.keys(value).length) {
    emitEvent(APP_EVENT_CONTRACTS_READY)
  }

  return <ContractsProviderContext.Provider value={value}>{children}</ContractsProviderContext.Provider>
}
