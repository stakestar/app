import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ChainId, RootState, TokenKey } from '~/features/core'

import { TokenBalance } from './types'

export type WalletState = {
  chainId: ChainId
  account: {
    address: string
    balances: TokenBalance[]
  }
}

const initialState: WalletState = {
  chainId: 0,
  account: {
    address: '',
    balances: []
  }
}

export const store = createSlice({
  name: 'wallet',
  initialState,

  reducers: {
    setChainId: (state, { payload: chainId }: PayloadAction<WalletState['chainId']>): void => {
      state.chainId = chainId
    },

    setAccountAddress: (state, { payload: accountAddress }: PayloadAction<WalletState['account']['address']>): void => {
      state.account.address = accountAddress
    },

    updateAccountBalances: (
      state,
      { payload: accountBalances }: PayloadAction<WalletState['account']['balances']>
    ): void => {
      accountBalances.forEach((item) => {
        const balanceToUpdate = state.account.balances.find(({ tokenKey }) => tokenKey === item.tokenKey)

        if (balanceToUpdate) {
          balanceToUpdate.balance = item.balance
        }
      })
    },

    resetState: () => initialState
  }
})

export const { setChainId, setAccountAddress, updateAccountBalances, resetState } = store.actions

export const selectWallet = (state: RootState): WalletState => state.wallet
export const selectAccaunt = (state: RootState): WalletState['account'] => state.wallet.account
export const selectAccauntBalance = (state: RootState, tokenKey: TokenKey): TokenBalance | undefined =>
  state.wallet.account.balances.find((balance) => balance.tokenKey === tokenKey)
