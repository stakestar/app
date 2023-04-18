import { Button, Container, Input, Link, Typography, toast } from '@onestaree/ui-kit'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { useMemo, useState } from 'react'

import { TokenAmount, Tooltip, getExplorerUrl, handleError, useBlockNumber, useContracts } from '~/features/core'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import { useConvertSstarEthToEth, useFetchStakingData, useLocalPool, usePendingUnstake } from '../hooks'
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

export function UnstakeTab(): JSX.Element {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(Loading.Resolved)
  const blockNumber = useBlockNumber()
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const balance = useAccountBalance('sstarETH')
  const fetchAccountBalances = useFetchAccountBalances()
  const { fetchStakingData } = useFetchStakingData()
  const pendingUnstake = usePendingUnstake()
  const localPool = useLocalPool()
  const convertSstarEthToEth = useConvertSstarEthToEth()
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)

  const ethAmount = useMemo(() => {
    return convertSstarEthToEth(new BigNumber(value || 0).shiftedBy(18).toString())
  }, [value, convertSstarEthToEth])

  const errors: {
    common: CommonError[]
    instantUnstake: InstantUnstakeError[]
  } = useMemo(() => {
    const commonErrors: CommonError[] = []
    const isStakeEthValueLessMin = getIsStakeEthValueLessMin(value)
    const isStakeEthValueMoreBalance = getIsStakeEthValueMoreBalance(value, balance)
    const ethAmountBigNumber = ethAmount.toBigNumber()

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
      const isValueGtPoolLimit = ethAmountBigNumber.gt(localPool.withdrawalLimit)
      const isValueGtPoolSize = ethAmountBigNumber.gt(localPool.size)

      const isInstantUnstakeAvailable =
        blockNumber &&
        blockNumber - parseInt(localPool.withdrawalHistory) > parseInt(localPool.withdrawalFrequencyLimit) &&
        blockNumber > parseInt(localPool.withdrawalHistory) + parseInt(localPool.withdrawalFrequencyLimit)

      if (isInstantUnstakeAvailable) {
        if (isValueGtPoolLimit) {
          instantUnstakeErrors.push(
            `${InstantUnstakeError.Limit} (${TokenAmount.fromWei('ETH', localPool.withdrawalLimit).toDecimal(
              2
            )} ETH)` as InstantUnstakeError.Limit
          )
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
  }, [ethAmount, balance, blockNumber, localPool, pendingUnstake, value])

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
      const weiToUnstake = TokenAmount.fromDecimal('ETH', value).toWei()

      const { transactionHash } = await (isInstantUnstake
        ? stakeStarContract.unstakeAndLocalPoolWithdraw
        : stakeStarContract.unstakeAndWithdraw)(weiToUnstake).then((transaction) => transaction.wait())

      await fetchStakingData()
      await fetchAccountBalances()
      setValue('')

      toast.show(
        <>
          {convertSstarEthToEth(weiToUnstake).toDecimal(4)} ETH was successfully withdrawn and unstaked.
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

    setLoading(Loading.Resolved)
  }

  return (
    <Container size="large">
      <Typography className="_mb-1" variant="h2">
        Withdraw and Unstake
      </Typography>
      <Input
        label={`Balance: ${balance.toDecimal(4)} sstarETH`}
        icon1="tokenEth"
        iconLabel="sstarETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={loading !== Loading.Resolved || address.length === 0}
        error={errors.common.some((error) => [CommonError.valueLtMin, CommonError.valueGtMax].includes(error))}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${balance.toDecimal(4)}`}
      />
      <Typography className={styles.Info} variant="text2">
        In most cases <b>Unstake</b> requires Ethereum validator to exit an active set. You will have to Claim your
        unstaked ETH later.
        <br />
        <br />
        <b>Instant Unstake</b> allows amounts smaller than{' '}
        {parseFloat(TokenAmount.fromWei('ETH', localPool.withdrawalLimit).toDecimal(2))} ETH to be unstaked instantly.
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
              title=""
              onClick={onClickUnstake}
              disabled={isUnstakeDisabled || !address || loading !== Loading.Resolved}
              loading={loading === Loading.Unstake}
            />
            <div
              className={classNames(styles.ButtonContent, {
                [styles.disabled]: isUnstakeDisabled || !address || loading === Loading.Unstake,
                [styles.loading]: loading === Loading.Unstake
              })}
            >
              Unstake
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
              title=""
              onClick={(): Promise<void> => onClickUnstake(true)}
              disabled={isInstantUnstakeDisabled || !address || loading !== Loading.Resolved}
              loading={loading === Loading.InstantUnstake}
            />
            <div
              className={classNames(styles.ButtonContent, {
                [styles.disabled]: isInstantUnstakeDisabled || !address || loading === Loading.InstantUnstake,
                [styles.loading]: loading === Loading.InstantUnstake
              })}
            >
              Instant Unstake
              <div className={styles.Icon}>?</div>
            </div>
          </Tooltip>
        </li>
      </ul>
      <Footer transactionType="unstake" ethAmount={value} />
    </Container>
  )
}
