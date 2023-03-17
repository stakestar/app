import { Button, Container, Input, Link, Typography, toast } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useEffect, useMemo, useState } from 'react'

import { TokenAmount, Tooltip, getExplorerUrl, handleError, useContracts, useDispatch } from '~/features/core'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import { usePendingUnstake } from '../hooks'
import { setPendingUnstake } from '../store'
import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import styles from './UnstakeTab.module.scss'
import {
  getIsStakeEthValueLessMin,
  getIsStakeEthValueMoreBalance,
  getSetValueByMultiplier,
  getUnstakeAndWithdrawGasRequired
} from './utils'

enum CommonError {
  valueEmpty = 'sstarETH value is empty',
  valueLtMin = 'sstarETH value is incorrect',
  valueGtMax = 'sstarETH value is incorrect',
  pendingUnstake = 'You already have a pending unstake/unclaimed amount'
}

enum InstantUnstakeError {}

type Errors = {
  common: CommonError[]
  instantUnstake: InstantUnstakeError[]
}

export function UnstakeTab(): JSX.Element {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { address } = useAccount()
  const balance = useAccountBalance('sstarETH')
  const { stakeStarContract } = useContracts()
  const fetchAccountBalances = useFetchAccountBalances()
  const pendingUnstake = usePendingUnstake()
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)

  const errors: Errors = useMemo(() => {
    const commonErrors: CommonError[] = []
    const isStakeEthValueLessMin = getIsStakeEthValueLessMin(value)
    const isStakeEthValueMoreBalance = getIsStakeEthValueMoreBalance(value, balance)

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

    return {
      common: commonErrors,
      instantUnstake: instantUnstakeErrors
    }
  }, [balance, pendingUnstake, value])

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

  const onClickUnstake = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const valueBigNumber = TokenAmount.fromDecimal('ETH', value.substring(0, 20)).toBigNumber()
      const gasRequired = await getUnstakeAndWithdrawGasRequired({ stakeStarContract, value: valueBigNumber })
      const valuePlusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.add(gasRequired)).toWei()
      const valueMinusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.sub(gasRequired)).toWei()
      const valueToUnstake = balance.toBigNumber().lt(valuePlusGas) ? valueMinusGas : valueBigNumber.toString()

      if (Number(valueToUnstake) > 0) {
        const { transactionHash } = await stakeStarContract
          .unstakeAndWithdraw(valueToUnstake)
          .then((transaction) => transaction.wait())

        await fetchAccountBalances()
        setValue('')

        toast.show(
          <>
            {TokenAmount.fromWei('ETH', valueToUnstake).toDecimal(4)} ETH was successfully staked.
            <Link className={styles.Link} icon="external" href={`${getExplorerUrl('tx', transactionHash)}`}>
              See on Etherscan
            </Link>
          </>,
          'success'
        )
      } else {
        toast.show('Insufficient funds', 'error', { autoclose: true })
      }
    } catch (error) {
      handleError(error, {
        message: error instanceof Error ? error?.message : undefined,
        displayGenericMessage: true
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (address) {
      Promise.all([
        stakeStarContract.localPoolSize(),
        stakeStarContract.localPoolWithdrawalLimit(),
        stakeStarContract.localPoolWithdrawalFrequencyLimit(),
        stakeStarContract.localPoolWithdrawalHistory(address),
        stakeStarContract.pendingWithdrawal(address)
      ])
        .then(
          ([
            localPoolSize,
            localPoolWithdrawalLimit,
            localPoolWithdrawalFrequencyLimit,
            localPoolWithdrawalHistory,
            pendingWithdrawal
          ]) => {
            dispatch(setPendingUnstake(pendingWithdrawal.toString()))

            const localPoolAvailableSize = localPoolWithdrawalLimit.lt(localPoolSize)
              ? localPoolWithdrawalLimit
              : localPoolSize
            // eslint-disable-next-line no-console
            console.log(localPoolWithdrawalFrequencyLimit, localPoolWithdrawalHistory, localPoolAvailableSize)
            // console.log(localPoolWithdrawalFrequencyLimit.toString(), localPoolWithdrawalHistory.toString())
          }
        )
        .catch(handleError)
    }
  }, [address, dispatch, pendingUnstake, stakeStarContract])

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
        disabled={isLoading}
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
            disabled={!isUnstakeDisabled || !address || isLoading}
          >
            <Button
              className={styles.Control}
              title="Untake"
              onClick={onClickUnstake}
              disabled={isUnstakeDisabled}
              loading={isLoading}
            />
            <div
              className={classNames(styles.DescribeDisableReasonButton, {
                [styles.disabled]: !isUnstakeDisabled || !address || isLoading
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
            disabled={!isInstantUnstakeDisabled || !address || isLoading}
          >
            <Button
              className={styles.Control}
              title="Instant Untake"
              onClick={onClickUnstake}
              disabled={isInstantUnstakeDisabled}
              loading={isLoading}
            />
            <div
              className={classNames(styles.DescribeDisableReasonButton, {
                [styles.disabled]: !isInstantUnstakeDisabled || !address || isLoading
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
