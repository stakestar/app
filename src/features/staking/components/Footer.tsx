import { Typography } from '@onestaree/ui-kit'
import { BigNumber as BigNumberJs } from 'bignumber.js'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { TokenAmount, handleError, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import { useConvertEthToUsd, useSsEthToEthRate } from '../hooks'
import { convertETHToSsETH } from '../utils'
import styles from './Footer.module.scss'
import { getGasRequired } from './utils'

interface FooterProps {
  transactionType: 'stake' | 'unstake'
  ethAmount: string
}

export function Footer({ transactionType, ethAmount }: FooterProps): JSX.Element {
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const [transactionCost, setTransactionCost] = useState('0.00')
  const convertEthToUsd = useConvertEthToUsd()
  const ssEthToEthRate = useSsEthToEthRate()
  const ssEthAmount =
    ethAmount && ssEthToEthRate
      ? convertETHToSsETH(new BigNumberJs(ethAmount).multipliedBy(10 ** 18).toString(), ssEthToEthRate)
      : 0

  const items = useMemo<{ title: string; value: string }[]>(() => {
    return [
      {
        title: 'You will receive',
        value: `${TokenAmount.fromWei('ssETH', ssEthAmount.toString()).toDecimal(4)} ${
          transactionType === 'stake' ? 'ssETH' : 'ETH'
        }`
      },
      {
        title: 'Exchange rate',
        value:
          ssEthToEthRate &&
          (transactionType === 'stake'
            ? `1.00 ETH = ${TokenAmount.fromWei(
                'ETH',
                convertETHToSsETH(new BigNumberJs(1).multipliedBy(10 ** 18).toString(), ssEthToEthRate).toString()
              ).toDecimal(6)} ssETH`
            : `1.00 ssETH = ${TokenAmount.fromWei('ETH', ssEthToEthRate).toDecimal(6)} ETH`)
      },
      { title: 'Transaction cost', value: `$${transactionCost}` }
    ]
  }, [ssEthAmount, ssEthToEthRate, transactionCost, transactionType])

  useEffect(() => {
    if (address) {
      // TODO: Add withdraw gas estimation
      getGasRequired({ address, stakeStarContract, value: BigNumber.from(1000) })
        .then((gasRequired) => setTransactionCost(convertEthToUsd(gasRequired).toFormat(4)))
        .catch(handleError)
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
