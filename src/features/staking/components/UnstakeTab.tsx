import { Button, Container, Input, Link, Typography, toast } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { TokenAmount, Tooltip, getExplorerUrl, handleError, useBlockNumber, useContracts } from '~/features/core'
import { convertSstarEthToEth, useLocalPool } from '~/features/staking'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import { usePendingUnstake, useSstarEthToEthRate } from '../hooks'
import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import styles from './UnstakeTab.module.scss'
import { getIsStakeEthValueLessMin, getIsStakeEthValueMoreBalance, getSetValueByMultiplier } from './utils'

enum Loading {
  Resolved,
  Unstake,
  InstantUnstake
}

enum CommonError {
  valueEmpty = 'sstarETH value is empty',
  valueLtMin = 'sstarETH value is incorrect',
  valueGtMax = 'sstarETH value is incorrect',
  pendingUnstake = 'You already have a pending unstake/unclaimed amount'
}

enum InstantUnstakeError {
  Timeout = 'You have recently used it. Please wait and try again later',
  Limit = 'sstarETH value is higher than the local pool limit',
  Size = 'sstarETH value is higher than the current amount of local pool liquidity'
}

type Errors = {
  common: CommonError[]
  instantUnstake: InstantUnstakeError[]
}

export function UnstakeTab(): JSX.Element {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(Loading.Resolved)
  const blockNumber = useBlockNumber()
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const balance = useAccountBalance('sstarETH')
  const fetchAccountBalances = useFetchAccountBalances()
  const pendingUnstake = usePendingUnstake()
  const localPool = useLocalPool()
  const sstarEthToEthRate = useSstarEthToEthRate()
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)

  const errors: Errors = useMemo(() => {
    const commonErrors: CommonError[] = []
    const isStakeEthValueLessMin = getIsStakeEthValueLessMin(value)
    const isStakeEthValueMoreBalance = getIsStakeEthValueMoreBalance(value, balance)
    const valueBigNumber = TokenAmount.fromDecimal('ETH', value).toBigNumber()

    if (!value) {
      commonErrors.push(CommonError.valueEmpty)
    }

    if (isStakeEthValueLessMin) {
      commonErrors.push(CommonError.valueLtMin)
    }

    if (isStakeEthValueMoreBalance) {
      commonErrors.push(CommonError.valueGtMax)
    }

    if (pendingUnstake.toBigNumber().gt(0)) {
      commonErrors.push(CommonError.pendingUnstake)
    }

    const instantUnstakeErrors: InstantUnstakeError[] = []

    if (value) {
      const isValueGtPoolLimit = valueBigNumber.gt(localPool.withdrawalLimit)
      const isValueGtPoolSize = valueBigNumber.gt(localPool.size)

      const isInstantUnstakeAvailable =
        blockNumber &&
        blockNumber - parseInt(localPool.withdrawalHistory) > parseInt(localPool.withdrawalFrequencyLimit) &&
        blockNumber > parseInt(localPool.withdrawalHistory) + parseInt(localPool.withdrawalFrequencyLimit)

      if (isInstantUnstakeAvailable) {
        if (isValueGtPoolLimit) {
          instantUnstakeErrors.push(InstantUnstakeError.Limit)
        } else if (isValueGtPoolSize) {
          instantUnstakeErrors.push(InstantUnstakeError.Size)
        }
      } else {
        instantUnstakeErrors.push(InstantUnstakeError.Timeout)
      }
    }

    return {
      common: commonErrors,
      instantUnstake: instantUnstakeErrors
    }
  }, [balance, blockNumber, localPool, pendingUnstake, value])

  const isUnstakeDisabled = !!errors.common.length
  const isInstantUnstakeDisabled = !!errors.common.length || !!errors.instantUnstake.length

  const tooltipValue = (isInstantUnstake: boolean): JSX.Element => (
    <div className={styles.TooltipValue}>
      <Typography className={styles.TooltipTitle} variant="h3">
        Why this button is disabled?
      </Typography>
      <ul className={styles.TooltipList}>
        {errors.common.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
        {isInstantUnstake && errors.instantUnstake.map((error, index) => <li key={index}>{error}</li>)}
      </ul>
    </div>
  )

  const onClickUnstake = async (isInstantUnstake = false): Promise<void> => {
    setLoading(isInstantUnstake ? Loading.InstantUnstake : Loading.Unstake)

    try {
      const balanceWei = balance.toWei()

      const { transactionHash } = await (isInstantUnstake
        ? stakeStarContract.unstakeAndLocalPoolWithdraw
        : stakeStarContract.unstakeAndWithdraw)(balanceWei).then((transaction) => transaction.wait())

      await fetchAccountBalances()
      setValue('')

      const balanceInEth = parseFloat(
        TokenAmount.fromWei('ETH', convertSstarEthToEth(balanceWei, sstarEthToEthRate).toString()).toDecimal()
      )

      toast.show(
        <>
          {balanceInEth} ETH was successfully withdrawn and unstaked.
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

    setLoading(Loading.Resolved)
  }

  return (
    <Container size="large">
      <Typography className="_mb-1" variant="h2">
        Withdraw and Unstake
      </Typography>
      <Input
        label={`Balance: ${parseFloat(balance.toDecimal(4))}`}
        icon1="tokenEth"
        iconLabel="sstarETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={loading !== Loading.Resolved}
        error={errors.common.some((error) => [CommonError.valueLtMin, CommonError.valueGtMax].includes(error))}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${balance.toString()}`}
      />
      <Typography className={styles.Info} variant="text2">
        In most cases <b>Unstake</b> requires Ethereum validator to exit an active set. The current exit queue will be
        processed approximately in XX days and YY hours. You will have to Claim your unstaked ETH later.
        <br />
        <br />
        <b>Instant Unstake</b> allows amounts smaller than 0.X ETH to be unstaked instantly.
      </Typography>
      <ul className={styles.Buttons}>
        <li className={styles.Button}>
          <Tooltip
            className={styles.Tooltip}
            value={tooltipValue(false)}
            disabled={!isUnstakeDisabled || !address || loading !== Loading.Resolved}
          >
            <Button
              className={styles.Control}
              title="Unstake"
              onClick={onClickUnstake}
              disabled={isUnstakeDisabled || !address || loading !== Loading.Resolved}
              loading={loading === Loading.Unstake}
            />
            <div
              className={classNames(styles.DescribeDisableReasonButton, {
                [styles.disabled]: !isUnstakeDisabled || !address || loading === Loading.Unstake
              })}
            >
              <div className={styles.Icon}>?</div>
            </div>
          </Tooltip>
        </li>
        <li className={styles.Button}>
          <Tooltip
            className={styles.Tooltip}
            value={tooltipValue(true)}
            disabled={!isInstantUnstakeDisabled || !address || loading !== Loading.Resolved}
          >
            <Button
              className={styles.Control}
              title="Instant Unstake"
              onClick={(): Promise<void> => onClickUnstake(true)}
              disabled={isInstantUnstakeDisabled || !address || loading !== Loading.Resolved}
              loading={loading === Loading.InstantUnstake}
            />
            <div
              className={classNames(styles.DescribeDisableReasonButton, {
                [styles.disabled]: !isInstantUnstakeDisabled || !address || loading === Loading.InstantUnstake
              })}
            >
              <div className={styles.Icon}>?</div>
            </div>
          </Tooltip>
        </li>
      </ul>
      <Footer transactionType="unstake" ethAmount={value} />
    </Container>
  )
}
