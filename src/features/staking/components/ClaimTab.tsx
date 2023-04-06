import { Button, Container, Link, Typography, toast } from '@onestaree/ui-kit'
import { useState } from 'react'

import { getExplorerUrl, handleError, useContracts } from '~/features/core'
import { useFetchStakingData, usePendingUnstake } from '~/features/staking'
import { useFetchAccountBalances } from '~/features/wallet'

import styles from './StakeTab.module.scss'

export function ClaimTab(): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const { stakeStarContract } = useContracts()
  const pendingUnstake = usePendingUnstake()
  const fetchAccountBalances = useFetchAccountBalances()
  const { fetchStakingData } = useFetchStakingData()
  const hasPendingUstake = pendingUnstake.toBigNumber().gt(0)

  const onClickClaim = async (): Promise<void> => {
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
        'success'
      )
    } catch (error) {
      handleError(error, {
        message: error instanceof Error ? error?.message : undefined,
        displayGenericMessage: true
      })
    }

    setIsLoading(false)
  }

  // useEffect(() => {
  //   if (address) {
  //     Promise.all([stakeStarContract.pendingWithdrawalSum()])
  //       .then(([pendingWithdrawalSum]) => {
  //         // console.log('??', pendingWithdrawalSum)
  //         // console.log('>>>', TokenAmount.fromWei('ETH', pendingWithdrawalSum.toString()).toDecimal())
  //       })
  //       .catch(handleError)
  //   }
  // }, [address, stakeStarContract])

  return (
    <Container size="large">
      <Typography className="_mb-4" variant="h2">
        Claim ETH
      </Typography>
      {hasPendingUstake ? (
        <Typography>You can claim {parseFloat(pendingUnstake.toDecimal())} ETH</Typography>
      ) : (
        <Typography>You have no pending unstakes</Typography>
      )}
      {/*
      <Typography>
        We are waiting for Ethereum chain to release XX.XX ETH. The current exit queue will be processed approximately
        in XX days and YY hours
      </Typography>
      */}
      <Button
        className={styles.Button}
        title="Claim"
        onClick={onClickClaim}
        disabled={isLoading || !hasPendingUstake}
        loading={isLoading}
      />
    </Container>
  )
}
