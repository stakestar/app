import { Button, Container, Input } from '@onestaree/ui-kit'
import { useState } from 'react'

import { useAccountSsEthBalance } from '../hooks'
import { minStakeEthValue } from './constants'
import { Footer } from './Footer'
import { getIsValueMinMaxError, getSetValueByMultiplier } from './utils'

export function Unstake(): JSX.Element {
  const [value, setValue] = useState('')
  const accountSsEthBalance = useAccountSsEthBalance()
  const setValueByMultiplier = getSetValueByMultiplier(setValue, accountSsEthBalance)
  const isValueMinMaxError = getIsValueMinMaxError(value, accountSsEthBalance)
  const [isLoading] = useState(false)

  return (
    <Container size="large">
      <Input
        title="Unstake ssETH"
        label={`Balance: ${accountSsEthBalance.toDecimal(2)}`}
        icon1="tokenEth"
        iconLabel="ssETH"
        placeholder="0.00"
        value={value}
        onChange={setValue}
        useMaxButton
        onClickMaxButton={setValueByMultiplier}
        disabled={isLoading}
        error={isValueMinMaxError}
        errorMessage={`Min value is ${minStakeEthValue} and your max is ${accountSsEthBalance.toString()}`}
      />
      <Button title="Untake" onClick={(): null => null} disabled={true} loading={isLoading} />
      <Footer transactionType="unstake" ethAmount={value} />
    </Container>
  )
}
