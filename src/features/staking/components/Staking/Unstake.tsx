import { Button, Container, Input } from '@onestaree/ui-kit'
import { useState } from 'react'

import { useSelector } from '~/features/core'
import { Footer } from '~/features/staking/components/Staking/Footer'

import { selectAccauntSsEthBalance } from '../../store'
import { minStakeEthValue } from './constants'
import { getIsValueMinMaxError, getSetValueByMultiplier } from './utils'

export function Unstake(): JSX.Element {
  const balance = useSelector(selectAccauntSsEthBalance)
  const [value, setValue] = useState('')
  const setValueByMultiplier = getSetValueByMultiplier(setValue, balance)
  const isValueMinMaxError = getIsValueMinMaxError(value, balance)
  const [isLoading] = useState(false)

  return (
    <Container size="large">
      <Input
        title="Unstake ssETH"
        label={`Balance: ${balance.toDecimal(2)}`}
        icon1="tokenEthereum"
        iconLabel="ssETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={isLoading}
        error={isValueMinMaxError}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${balance.toString()}`}
      />
      <Button title="Untake" onClick={(): null => null} disabled={true} loading={isLoading} />
      <Footer transactionType="unstake" ethAmount={value} />
    </Container>
  )
}
