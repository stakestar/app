import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DailyTvls, RootState } from '~/features/core'
import { TokenAmount, TokenAmountEncoded } from '~/features/core/entities/TokenAmount' // Because of circular dependency

export type StakingState = {
  activeValidatorsCount: number
  ethPriceUSD: string
  sstarEthPriceUSD: string
  sstarEthToEthRate: string
  stakerRateDiff: string
  pendingUnstake: string
  apr: number
  dailyTvls: DailyTvls
  totalSstarEth: TokenAmountEncoded
}

const emptySstarEth = TokenAmount.fromDecimal('sstarETH', 0).toEncoded()

const initialState: StakingState = {
  activeValidatorsCount: 0,
  ethPriceUSD: '',
  sstarEthPriceUSD: '',
  sstarEthToEthRate: '',
  stakerRateDiff: '',
  pendingUnstake: '',
  apr: 0,
  dailyTvls: [],
  totalSstarEth: emptySstarEth
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

    setSstarEthPriceUSD: (
      state,
      { payload: sstarEthPriceUSD }: PayloadAction<StakingState['sstarEthPriceUSD']>
    ): void => {
      state.sstarEthPriceUSD = sstarEthPriceUSD
    },

    setSstarEthToEthRate: (
      state,
      { payload: sstarEthToEthRate }: PayloadAction<StakingState['sstarEthToEthRate']>
    ): void => {
      state.sstarEthToEthRate = sstarEthToEthRate
    },

    setStakerRateDiff: (state, { payload: stakerRateDiff }: PayloadAction<StakingState['stakerRateDiff']>): void => {
      state.stakerRateDiff = stakerRateDiff
    },

    setApr: (state, { payload: apr }: PayloadAction<StakingState['apr']>): void => {
      state.apr = apr
    },

    setDailyTvls: (state, { payload: dailyTvls }: PayloadAction<StakingState['dailyTvls']>): void => {
      state.dailyTvls = dailyTvls
    },

    setTotalSstarEth: (state, { payload: totalSstarEth }: PayloadAction<string>): void => {
      state.totalSstarEth = TokenAmount.fromWei('sstarETH', totalSstarEth).toEncoded()
    },

    setPendingUnstake: (state, { payload: pendingUnstake }: PayloadAction<string>): void => {
      state.pendingUnstake = pendingUnstake
    },

    resetState: () => initialState
  }
})

export const {
  setActiveValidatorsCount,
  setEthPriceUSD,
  setSstarEthPriceUSD,
  setSstarEthToEthRate,
  setStakerRateDiff,
  setApr,
  setDailyTvls,
  setTotalSstarEth,
  setPendingUnstake,
  resetState
} = store.actions

export const selectStaking = (state: RootState): StakingState => state.staking
export const selectActiveValidatorsCount = (state: RootState): StakingState['activeValidatorsCount'] =>
  state.staking.activeValidatorsCount
export const selectEthPriceUSD = (state: RootState): StakingState['ethPriceUSD'] => state.staking.ethPriceUSD
export const selectSstarEthPriceUSD = (state: RootState): StakingState['sstarEthPriceUSD'] =>
  state.staking.sstarEthPriceUSD
export const selectSstarEthToEthRate = (state: RootState): StakingState['sstarEthToEthRate'] =>
  state.staking.sstarEthToEthRate
export const selectApr = (state: RootState): StakingState['apr'] => state.staking.apr
export const selectStakerRateDiff = (state: RootState): StakingState['stakerRateDiff'] => state.staking.stakerRateDiff
export const selectPendingUnstake = (state: RootState): StakingState['pendingUnstake'] => state.staking.pendingUnstake
export const selectDailyTvls = (state: RootState): StakingState['dailyTvls'] => state.staking.dailyTvls
export const selectTotalSstarEth = (state: RootState): TokenAmount =>
  TokenAmount.fromEncoded(state.staking.totalSstarEth)
