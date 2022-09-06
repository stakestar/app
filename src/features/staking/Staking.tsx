import { Input } from '@onestaree/ui-kit'
import { useState } from 'react'

import { TokenAmount, useContracts } from '~/features/core'
import { useAccount } from '~/features/wallet'

import styles from './Staking.module.scss'

export function Staking(): JSX.Element {
  const { address } = useAccount()
  const { stakeStarContract } = useContracts()
  const [value, setValue] = useState('')

  const onClick = (): void => {
    void stakeStarContract.stake({ from: address, value: TokenAmount.fromDecimal('ETH', value).toWei() })
  }

  return (
    <div className={styles.Container}>
      <Input
        icon1="tokenEthereum"
        iconLabel="ETH"
        buttonText="Stake"
        buttonOnClick={onClick}
        placeholder="0.00"
        value={value}
        onChange={setValue}
      />
    </div>
  )
}
