import { Typography } from '@onestaree/ui-kit'
import { BigNumber as BigNumberJs } from 'bignumber.js'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { TokenAmount, handleError, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import { useConvertEthToUsd, useSstarEthToEthRate } from '../hooks'
import { convertEthToSstarEth, convertSstarEthToEth } from '../utils'
import styles from './Footer.module.scss'
import { getDepositAndStakeGasRequired } from './utils'

interface FooterProps {
  transactionType: 'stake' | 'unstake'
  ethAmount: string
}

export function Footer({ transactionType, ethAmount }: FooterProps): JSX.Element {
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const [transactionCost, setTransactionCost] = useState('0.00')
  const convertEthToUsd = useConvertEthToUsd()
  const sstarEthToEthRate = useSstarEthToEthRate()
  const reciveAmount =
    ethAmount && sstarEthToEthRate
      ? transactionType === 'stake'
        ? convertEthToSstarEth(new BigNumberJs(ethAmount).shiftedBy(18).toString(), sstarEthToEthRate)
        : convertSstarEthToEth(new BigNumberJs(ethAmount).shiftedBy(18).toString(), sstarEthToEthRate)
      : 0

  const items = useMemo<{ title: string; value: string }[]>(() => {
    return [
      {
        title: 'You will receive',
        value: `${TokenAmount.fromWei('sstarETH', reciveAmount.toString()).toDecimal(4)} ${
          transactionType === 'stake' ? 'sstarETH' : 'ETH'
        }`
      },
      {
        title: 'Exchange rate',
        value:
          sstarEthToEthRate &&
          // (transactionType === 'stake'
          //   ? `1.00 sstarETH = ${TokenAmount.fromWei('ETH', sstarEthToEthRate).toDecimal(6)} ETH`
          //   : `1.00 ETH = ${TokenAmount.fromWei(
          //       'ETH',
          //       convertEthToSstarEth(new BigNumberJs(1).shiftedBy(18).toString(), sstarEthToEthRate).toString()
          //     ).toDecimal(6)} sstarETH`)
          `1.00 sstarETH = ${TokenAmount.fromWei('ETH', sstarEthToEthRate).toDecimal(6)} ETH`
      },
      { title: 'Transaction cost', value: `$${transactionCost}` }
    ]
  }, [reciveAmount, sstarEthToEthRate, transactionCost, transactionType])

  useEffect(() => {
    if (address) {
      // TODO: Add withdraw gas estimation
      getDepositAndStakeGasRequired({ address, stakeStarContract, value: BigNumber.from(1000) })
        .then((gasRequired) => setTransactionCost(convertEthToUsd(gasRequired).toFormat(4)))
        .catch(handleError)

      // TODO: Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT ] (reason="execution reverted: one withdrawal at a time only", method="estimateGas"
      // getUnstakeAndWithdrawGasRequired({ stakeStarContract, value: BigNumber.from(1000) })
      //   .then((gasRequired) => setTransactionCost(convertEthToUsd(gasRequired).toFormat(4)))
      //   .catch(handleError)
    }
  }, [address, convertEthToUsd, stakeStarContract])

  return (
    <ul className={styles.Footer}>
      {items.map(({ title, value }) => (
        <li key={title} className={styles.Row}>
          <Typography className={styles.Text} variant="text1">
            {title}
          </Typography>
          <Typography className={styles.Text}>{value}</Typography>
        </li>
      ))}
    </ul>
  )
}
