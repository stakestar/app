import { StakeStar, StakeStarReceipt, StakeStarReceipt__factory, StakeStar__factory } from '@stakestar/contracts'
import { PropsWithChildren, createContext, useMemo, useState } from 'react'

import { useChainConfig, useConnector } from '~/features/wallet'

import { APP_EVENT_CONTRACTS_READY } from '../constants'
import { emitEvent, handleError } from '../utils'

export type ContractsProviderValue = {
  stakeStarContract: StakeStar
  stakeStarReceiptContract: StakeStarReceipt
}

export const ContractsProviderContext = createContext({} as ContractsProviderValue)

export function ContractsProvider({ children }: PropsWithChildren): JSX.Element {
  const { contractsAddresses } = useChainConfig()
  const { connector } = useConnector()
  const provider = connector.hooks.useProvider()
  const [stakeStarReceiptAddress, setStakeStarReceiptAddress] = useState('')

  const value = useMemo((): ContractsProviderValue => {
    const initialValue = {} as ContractsProviderValue

    if (!provider) {
      return initialValue
    }

    const signerOrProvider = provider?.getSigner?.() || provider

    try {
      const stakeStarContract = StakeStar__factory.connect(contractsAddresses.stakeStar, signerOrProvider)

      Promise.all([stakeStarContract.stakeStarReceipt()])
        .then(([stakeStarReceipt]) => {
          setStakeStarReceiptAddress(stakeStarReceipt)
        })
        .catch((error) => handleError(error, { displayGenericMessage: true }))

      return stakeStarReceiptAddress
        ? {
            stakeStarContract,
            stakeStarReceiptContract: StakeStarReceipt__factory.connect(stakeStarReceiptAddress, signerOrProvider)
          }
        : initialValue
    } catch (error) {
      handleError(error, { displayGenericMessage: true })

      return initialValue
    }
  }, [contractsAddresses, provider, stakeStarReceiptAddress])

  if (Object.keys(value).length) {
    emitEvent(APP_EVENT_CONTRACTS_READY)
  }

  return <ContractsProviderContext.Provider value={value}>{children}</ContractsProviderContext.Provider>
}
