import { Typography } from '@onestaree/ui-kit'
import { BigNumber } from 'ethers'
import { useEffect, useMemo, useState } from 'react'

import { TokenAmount, handleError, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import { useConvertEthToUsd, useSsEthToEthRate } from '../hooks'
import styles from './Footer.module.scss'
import { getGasRequired } from './utils'

interface FooterProps {
  transactionType: 'stake' | 'unstake'
  ethAmount: string
}

export function Footer({ transactionType, ethAmount }: FooterProps): JSX.Element {
  const ssEthAmount = TokenAmount.fromDecimal('ETH', ethAmount || 0).toDecimal(2)
  const { stakeStarContract } = useContracts()
  const { address } = useAccount()
  const [transactionCost, setTransactionCost] = useState('0.00')
  const convertEthToUsd = useConvertEthToUsd()
  const ssEthToEthRate = useSsEthToEthRate()

  const items = useMemo<{ title: string; value: string }[]>(() => {
    return [
      { title: 'You will receive', value: `${ssEthAmount} ${transactionType === 'stake' ? 'ssETH' : 'ETH'}` },
      {
        title: 'Exchange rate',
        value:
          ssEthToEthRate &&
          (transactionType === 'stake'
            ? `1.00 ETH = ${TokenAmount.fromWei('ssETH', ssEthToEthRate).toDecimal(2)} ssETH`
            : `1.00 ssETH = ${TokenAmount.fromBigNumber(
                'ETH',
                TokenAmount.fromDecimal('ETH', 1).toBigNumber().div(ssEthToEthRate)
              ).toDecimal(2)} ETH`)
      },
      { title: 'Transaction cost', value: `$${transactionCost}` }
    ]
  }, [ssEthAmount, ssEthToEthRate, transactionCost, transactionType])

  useEffect(() => {
    if (address) {
      // TODO: Add withdraw gas estimation
      getGasRequired({ address, stakeStarContract, value: BigNumber.from(1000) })
        .then((gasRequired) => setTransactionCost(convertEthToUsd(gasRequired).toFormat(2)))
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
