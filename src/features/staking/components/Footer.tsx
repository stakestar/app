import { Typography } from '@onestaree/ui-kit'
import { BigNumber as BigNumberJs } from 'bignumber.js'
import { useMemo } from 'react'

import { TokenAmount } from '~/features/core'

import { useSstarEthToEthRate, useTransactionCostByType } from '../hooks'
import { convertEthToSstarEth, convertSstarEthToEth } from '../utils'
import styles from './Footer.module.scss'

interface FooterProps {
  transactionType: 'stake' | 'unstake'
  ethAmount: string
}

export function Footer({ transactionType, ethAmount }: FooterProps): JSX.Element {
  const transactionCost = useTransactionCostByType(transactionType)
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
      { title: 'Transaction cost', value: parseFloat(transactionCost) ? `$${transactionCost}` : '-' }
    ]
  }, [reciveAmount, sstarEthToEthRate, transactionCost, transactionType])

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
