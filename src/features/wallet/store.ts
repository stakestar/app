import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ChainId, RootState, TokenAmount, TokenAmountEncoded, TokenId, tokens } from '~/features/core'

type AccountBalances = Record<TokenId, TokenAmountEncoded>

export type WalletState = {
  chainId: ChainId
  account: {
    address: string
    balances: AccountBalances
  }
}

const initialState: WalletState = {
  chainId: 0,
  account: {
    address: '',
    balances: Object.keys(tokens).reduce((result, tokenId) => {
      result[tokenId as TokenId] = TokenAmount.fromWei(tokenId as TokenId, '0').toEncoded()

      return result
    }, {} as AccountBalances)
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
      {
        payload: accountBalances
      }: PayloadAction<
        {
          balance: string
          tokenId: TokenId
        }[]
      >
    ): void => {
      accountBalances.forEach(({ tokenId, balance }) => {
        state.account.balances[tokenId] = TokenAmount.fromWei(tokenId as TokenId, balance).toEncoded()
      })
    },

    resetState: () => initialState
  }
})

export const { setChainId, setAccountAddress, updateAccountBalances, resetState } = store.actions

export const selectWallet = (state: RootState): WalletState => state.wallet
export const selectAccaunt = (state: RootState): WalletState['account'] => state.wallet.account
export const selectAccauntBalance = (state: RootState, tokenId: TokenId): TokenAmount =>
  TokenAmount.fromEncoded(state.wallet.account.balances[tokenId])
