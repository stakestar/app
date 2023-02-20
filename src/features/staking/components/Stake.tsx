import { Button, Container, Input, Link, Typography, toast } from '@onestaree/ui-kit'
import { useEffect, useState } from 'react'

import { TokenAmount, getExplorerUrl, handleError, useContracts, useDispatch } from '~/features/core'
import { setAccountSsEthBalance } from '~/features/staking/store'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import styles from './Stake.module.scss'
import {
  getGasRequired,
  getIsStakeEthValueLessMin,
  getIsStakeEthValueMoreBalance,
  getSetValueByMultiplier
} from './utils'

export function Stake(): JSX.Element {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const balance = useAccountBalance('ETH')
  const [value, setValue] = useState('')
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)
  const isStakeEthValueLessMin = getIsStakeEthValueLessMin(value)
  const isStakeEthValueMoreBalance = getIsStakeEthValueMoreBalance(value, balance)
  const [isLoading, setIsLoading] = useState(false)
  const { stakeStarContract, stakeStarEthContract } = useContracts()
  const fetchAccountBalances = useFetchAccountBalances()

  const stake = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const valueBigNumber = TokenAmount.fromDecimal('ETH', value.substring(0, 20)).toBigNumber()
      const gasRequired = await getGasRequired({ address, stakeStarContract, value: valueBigNumber })
      const valuePlusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.add(gasRequired)).toWei()
      const valueMinusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.sub(gasRequired)).toWei()
      const valueToStake = balance.toBigNumber().lt(valuePlusGas) ? valueMinusGas : valueBigNumber.toString()

      if (Number(valueToStake) > 0) {
        const { transactionHash } = await stakeStarContract
          .stake({
            from: address,
            value: valueToStake
          })
          .then((transaction) => transaction.wait())

        await fetchAccountBalances()
        setValue('')

        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract
          .balanceOf(address)
          .then((ssEthBalance) =>
            dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
          )
          .catch(handleError)

        toast.show(
          <>
            {TokenAmount.fromWei('ETH', valueToStake).toDecimal(4)} ETH was successfully staked.
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
    if (address.length === 0) {
      setValue('')
    }
  }, [address])

  return (
    <Container size="large">
      <Typography className="_mb-1" variant="h2">
        Stake ETH
      </Typography>
      <Input
        label={`Balance: ${balance.toDecimal(4)}`}
        icon1="tokenEth"
        iconLabel="ETH"
        placeholder="0.0000"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={isLoading || address.length === 0}
        error={isStakeEthValueLessMin || isStakeEthValueMoreBalance}
        errorMessage={
          isStakeEthValueLessMin
            ? `Minimum stake amount is ${minStakeEthValue} ETH`
            : isStakeEthValueMoreBalance
            ? 'Insufficient funds'
            : ''
        }
      />
      <Button
        className={styles.Button}
        title="Stake"
        onClick={stake}
        disabled={!value || isStakeEthValueLessMin || isStakeEthValueMoreBalance || isLoading}
        loading={isLoading}
      />
      <Footer transactionType="stake" ethAmount={value} />
    </Container>
  )
}
