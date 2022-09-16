import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState, TokenAmount, TokenAmountEncoded } from '~/features/core'

export type StakingState = {
  ssEthToEthRate: TokenAmountEncoded
  account: {
    ssEthBalance: TokenAmountEncoded
  }
  total: {
    ssEthBalance: TokenAmountEncoded
  }
}

const emptySsEth = TokenAmount.fromDecimal('ssETH', 0).toEncoded()

const initialState: StakingState = {
  ssEthToEthRate: emptySsEth,
  account: {
    ssEthBalance: emptySsEth
  },
  total: {
    ssEthBalance: emptySsEth
  }
}

export const store = createSlice({
  name: 'staking',
  initialState,

  reducers: {
    setSsEthToEthRate: (state, { payload: ssEthToEthRate }: PayloadAction<StakingState['ssEthToEthRate']>): void => {
      state.ssEthToEthRate = ssEthToEthRate
    },

    setAccountSsEthBalance: (
      state,
      { payload: ssEthBalance }: PayloadAction<StakingState['account']['ssEthBalance']>
    ): void => {
      state.account.ssEthBalance = ssEthBalance
    },

    setTotalSsEthBalance: (
      state,
      { payload: ssEthBalance }: PayloadAction<StakingState['total']['ssEthBalance']>
    ): void => {
      state.total.ssEthBalance = ssEthBalance
    },

    resetState: () => initialState
  }
})

export const { setSsEthToEthRate, setAccountSsEthBalance, setTotalSsEthBalance, resetState } = store.actions

export const selectStaking = (state: RootState): StakingState => state.staking
export const selectAccauntBalance = (state: RootState): TokenAmount =>
  TokenAmount.fromEncoded(state.staking.account.ssEthBalance)
export const selectTotalBalance = (state: RootState): TokenAmount =>
  TokenAmount.fromEncoded(state.staking.total.ssEthBalance)
