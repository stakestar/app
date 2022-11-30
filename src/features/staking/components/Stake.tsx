import { Button, Container, Input, Link, toast } from '@onestaree/ui-kit'
import { useState } from 'react'

import { TokenAmount, getExplorerUrl, handleError, useContracts, useDispatch } from '~/features/core'
import { setAccountSsEthBalance } from '~/features/staking/store'
import { useAccount, useAccountBalance, useFetchAccountBalances } from '~/features/wallet'

import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import styles from './Stake.module.scss'
import { getGasRequired, getIsValueMinMaxError, getSetValueByMultiplier } from './utils'

export function Stake(): JSX.Element {
  const dispatch = useDispatch()
  const { address } = useAccount()
  const balance = useAccountBalance('ETH')
  const [value, setValue] = useState('')
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)
  const isValueMinMaxError = getIsValueMinMaxError(value, balance)
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

        // TODO: Refactor stakeStarEthContract.balanceOf to useFetchAccountSsEthBalance
        stakeStarEthContract
          .balanceOf(address)
          .then((ssEthBalance) =>
            dispatch(setAccountSsEthBalance(TokenAmount.fromWei('ssETH', ssEthBalance.toString()).toEncoded()))
          )
          .catch(handleError)

        toast.show(
          <>
            {TokenAmount.fromWei('ETH', valueToStake).toDecimal(2)} ETH was successfully staked.
            <Link className={styles.Link} icon="external" href={`${getExplorerUrl('tx', transactionHash)}`}>
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

  return (
    <Container size="large">
      <Input
        title="Stake ETH"
        label={`Balance: ${balance.toDecimal(2)}`}
        icon1="tokenEth"
        iconLabel="ETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={isLoading}
        error={isValueMinMaxError}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${balance.toString()}`}
      />
      <Button title="Stake" onClick={stake} disabled={!value || isValueMinMaxError || isLoading} loading={isLoading} />
      <Footer transactionType="stake" ethAmount={value} />
    </Container>
  )
}
