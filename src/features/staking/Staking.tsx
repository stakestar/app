import { Button, Input, Link, toast } from '@onestaree/ui-kit'
import { useEffect, useState } from 'react'

import { TokenAmount, getExplorerUrl, handleError, useContracts } from '~/features/core'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import styles from './Staking.module.scss'
import { useStakeStarTvlsQuery } from './useStakeStarTvlsQuery'

const minValue = 0.001

export function Staking(): JSX.Element {
  const { address } = useAccount()
  const balance = useAccountBalance('ETH')
  const { stakeStarContract, stakeStarReceiptContract } = useContracts()
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fetchAccountBalances = useFetchAccountBalances()
  // TODO: Continue here (https://www.the-guild.dev/graphql/codegen)
  const {
    loading,
    // error: queryError,
    data
  } = useStakeStarTvlsQuery()

  if (!loading) {
    // eslint-disable-next-line no-console
    console.log('data', data)
  }

  const isMinMaxError =
    !!value.length &&
    (Number(value) < minValue || balance.toBigNumber().lt(TokenAmount.fromDecimal('ETH', value).toWei()))

  const onClickMaxButton = (multiplier: number): void => {
    if (balance.toBigNumber().gt(0)) {
      setValue(
        TokenAmount.fromBigNumber(
          'ETH',
          balance
            .toBigNumber()
            .mul(multiplier * 100)
            .div(100)
        ).toString()
      )
    }
  }

  const onClickStake = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const valueBigNumber = TokenAmount.fromDecimal('ETH', value.substring(0, 20)).toBigNumber()

      const gasRequired = await stakeStarContract.estimateGas
        .stake({
          from: address,
          // Subtract 1 wei to prevent error for "value = max" estimation
          value: valueBigNumber.sub(1).toString()
        })
        .then(
          (response) =>
            response
              .mul(10 ** 9) // Equivalent to "Low" in MetaMask
              .mul(2) // Equivalent to "Aggressive" in MetaMask
        )

      const valuePlusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.add(gasRequired)).toWei()
      const valueMinusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.sub(gasRequired)).toWei()
      const valueToStake = balance.toBigNumber().lt(valuePlusGas) ? valueMinusGas : valuePlusGas

      if (Number(valueToStake) > 0) {
        const { transactionHash } = await stakeStarContract
          .stake({
            from: address,
            value: valueToStake
          })
          .then((transaction) => transaction.wait())

        await fetchAccountBalances()
        setValue('')

        toast.show(
          <>
            {TokenAmount.fromWei('ETH', valueToStake).toDecimal(2)} ETH was successfully staked.
            <Link icon="external" href={`${getExplorerUrl('tx', transactionHash)}`}>
              See more details on Etherscan
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
    stakeStarReceiptContract
      .rate()
      .then((rate) => {
        // TODO: Use rate
        // eslint-disable-next-line no-console
        console.log('rate', TokenAmount.fromWei('ETH', rate).toNumber())
      })
      .catch(handleError)
  }, [stakeStarReceiptContract])

  return (
    <div className={styles.Container}>
      <Input
        icon1="tokenEthereum"
        iconLabel="ETH"
        placeholder="0.00"
        label={`Balance: ${balance.toDecimal(2)}`}
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={onClickMaxButton}
        disabled={isLoading}
        error={isMinMaxError}
        errorMessage={`Min value is ${minValue} and your max is ${balance.toString()}`}
      />
      <Button
        title="Stake"
        onClick={onClickStake}
        disabled={!value || isMinMaxError || isLoading}
        loading={isLoading}
      />
    </div>
  )
}
