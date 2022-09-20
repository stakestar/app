import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '~/features/core'
import { TokenAmount, TokenAmountEncoded } from '~/features/core/entities/TokenAmount' // Because of circular dependency

export type StakingState = {
  activeValidatorsCount: number
  ethPriceUSD: string
  ssEthPriceUSD: string
  ssEthToEthRate: string
  account: {
    ssEthBalance: TokenAmountEncoded
  }
  total: {
    ssEthBalance: TokenAmountEncoded
  }
}

const emptySsEth = TokenAmount.fromDecimal('ssETH', 0).toEncoded()

const initialState: StakingState = {
  activeValidatorsCount: 0,
  ethPriceUSD: '',
  ssEthPriceUSD: '',
  ssEthToEthRate: '',
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
    setActiveValidatorsCount: (
      state,
      { payload: activeValidatorsCount }: PayloadAction<StakingState['activeValidatorsCount']>
    ): void => {
      state.activeValidatorsCount = activeValidatorsCount
    },

    setEthPriceUSD: (state, { payload: ethPriceUSD }: PayloadAction<StakingState['ethPriceUSD']>): void => {
      state.ethPriceUSD = ethPriceUSD
    },

    setSsEthPriceUSD: (state, { payload: ssEthPriceUSD }: PayloadAction<StakingState['ssEthPriceUSD']>): void => {
      state.ssEthPriceUSD = ssEthPriceUSD
    },

    setSsEthToEthRate: (state, { payload: ssEthToEthRate }: PayloadAction<StakingState['ssEthToEthRate']>): void => {
      state.ssEthToEthRate = ssEthToEthRate
    },

    setAccountSsEthBalance: (
      state,
      { payload: ssEthBalance }: PayloadAction<StakingState['account']['ssEthBalance']>
    ): void => {
      state.account.ssEthBalance = ssEthBalance
    },

    setTotalSsEthBalance: (state, { payload: ssEthBalance }: PayloadAction<string>): void => {
      state.total.ssEthBalance = TokenAmount.fromWei('ssETH', ssEthBalance).toEncoded()
    },

    resetState: () => initialState
  }
})

export const {
  setActiveValidatorsCount,
  setEthPriceUSD,
  setSsEthPriceUSD,
  setSsEthToEthRate,
  setAccountSsEthBalance,
  setTotalSsEthBalance,
  resetState
} = store.actions

export const selectStaking = (state: RootState): StakingState => state.staking
export const selectActiveValidatorsCount = (state: RootState): StakingState['activeValidatorsCount'] =>
  state.staking.activeValidatorsCount
export const selectEthPriceUSD = (state: RootState): StakingState['ethPriceUSD'] => state.staking.ethPriceUSD
export const selectSsEthPriceUSD = (state: RootState): StakingState['ssEthPriceUSD'] => state.staking.ssEthPriceUSD
export const selectSsEthToEthRate = (state: RootState): StakingState['ssEthToEthRate'] => state.staking.ssEthToEthRate
export const selectAccauntSsEthBalance = (state: RootState): TokenAmount =>
  TokenAmount.fromEncoded(state.staking.account.ssEthBalance)
export const selectTotalSsEthBalance = (state: RootState): TokenAmount =>
  TokenAmount.fromEncoded(state.staking.total.ssEthBalance)
