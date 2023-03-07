import { Button, Container, Input, Link, Typography, toast } from '@onestaree/ui-kit'
import { useState } from 'react'

import { TokenAmount, getExplorerUrl, handleError, useContracts, useDispatch } from '~/features/core'
import { setAccountSsEthBalance } from '~/features/staking/store'
import { useAccount, useFetchAccountBalances } from '~/features/wallet'

import { useAccountSsEthBalance } from '../hooks'
import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import styles from './Stake.module.scss'
import {
  getIsStakeEthValueLessMin,
  getIsStakeEthValueMoreBalance,
  getSetValueByMultiplier,
  getUnstakeGasRequired
} from './utils'

export function Unstake(): JSX.Element {
  const [value, setValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { address } = useAccount()
  const accountSsEthBalance = useAccountSsEthBalance()
  const setValueByMultiplier = getSetValueByMultiplier(setValue, accountSsEthBalance)
  const isStakeEthValueLessMin = getIsStakeEthValueLessMin(value)
  const isStakeEthValueMoreBalance = getIsStakeEthValueMoreBalance(value, accountSsEthBalance)
  const { stakeStarContract, stakeStarEthContract } = useContracts()
  const fetchAccountBalances = useFetchAccountBalances()

  const onClickUnstake = async (): Promise<void> => {
    setIsLoading(true)

    try {
      const valueBigNumber = TokenAmount.fromDecimal('ETH', value.substring(0, 20)).toBigNumber()
      const gasRequired = await getUnstakeGasRequired({ stakeStarContract, value: valueBigNumber })
      const valuePlusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.add(gasRequired)).toWei()
      const valueMinusGas = TokenAmount.fromBigNumber('ETH', valueBigNumber.sub(gasRequired)).toWei()
      const valueToUnstake = accountSsEthBalance.toBigNumber().lt(valuePlusGas)
        ? valueMinusGas
        : valueBigNumber.toString()

      if (Number(valueToUnstake) > 0) {
        const { transactionHash } = await stakeStarContract
          .unstake(valueToUnstake)
          .then((transaction) => transaction.wait())

        await fetchAccountBalances()
        setValue('')

        stakeStarEthContract
          .balanceOf(address)
          .then((ssEthBalance) =>
            dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
          )
          .catch(handleError)

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

  return (
    <Container size="large">
      <Typography className="_mb-1" variant="h2">
        Unstake ssETH
      </Typography>
      <Input
        label={`Balance: ${parseFloat(accountSsEthBalance.toDecimal(4))}`}
        icon1="tokenEth"
        iconLabel="ssETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={isLoading}
        error={isStakeEthValueLessMin || isStakeEthValueMoreBalance}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${accountSsEthBalance.toString()}`}
      />
      <Button
        title="Untake"
        onClick={onClickUnstake}
        disabled={!value || isStakeEthValueLessMin || isStakeEthValueMoreBalance || isLoading}
        loading={isLoading}
      />
      <Footer transactionType="unstake" ethAmount={value} />
    </Container>
  )
}
