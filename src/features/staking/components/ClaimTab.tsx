import { Button, Container, Link, Typography, toast } from '@onestaree/ui-kit'
import { useState } from 'react'

import { getExplorerUrl, handleError, useContracts, useEventListener } from '~/features/core'
import { useFetchAccountBalances } from '~/features/wallet'

import { STAKING_EVENT_CLAIM } from '../constants'
import { useFetchStakingData, usePendingUnstake } from '../hooks'
import styles from './StakeTab.module.scss'

export function ClaimTab(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const { stakeStarContract } = useContracts()
  const pendingUnstake = usePendingUnstake()
  const fetchAccountBalances = useFetchAccountBalances()
  const { fetchStakingData, pendingUnstakeQueueIndex } = useFetchStakingData()
  const hasPendingUstake = pendingUnstake.toBigNumber().gt(0)
  const isClaimDisabled = isLoading || !hasPendingUstake || !pendingUnstakeQueueIndex

  const onClickClaim = async (): Promise<void> => {
    if (isClaimDisabled) {
      return
    }

    setIsLoading(true)

    try {
      const { transactionHash } = await stakeStarContract.claim().then((transaction) => transaction.wait())

      await fetchStakingData()
      await fetchAccountBalances()

      toast.show(
        <>
          {parseFloat(pendingUnstake.toDecimal())} ETH was successfully claimed.
          <Link className={styles.Link} icon="external" href={`${getExplorerUrl('tx', transactionHash)}`}>
            See on Etherscan
          </Link>
        </>,
        'success',
        { autocloseTimeout: 30000 }
      )
    } catch (error) {
      handleError(error, {
        message: error instanceof Error ? error?.message : undefined,
        displayGenericMessage: true
      })
    }

    setIsLoading(false)
  }

  useEventListener(STAKING_EVENT_CLAIM, onClickClaim)

  return (
    <Container size="large">
      <Typography className="_mb-4" variant="h2">
        Claim ETH
      </Typography>
      {hasPendingUstake ? (
        <Typography>
          {pendingUnstakeQueueIndex
            ? `You can claim ${parseFloat(pendingUnstake.toDecimal(4))} ETH`
            : `We are waiting for Ethereum chain to release ${parseFloat(pendingUnstake.toDecimal(4))} ETH.`}
        </Typography>
      ) : (
        <Typography>You have no pending unstakes</Typography>
      )}
      <Button
        className={styles.Button}
        title="Claim"
        onClick={onClickClaim}
        disabled={isClaimDisabled}
        loading={isLoading}
      />
    </Container>
  )
}
