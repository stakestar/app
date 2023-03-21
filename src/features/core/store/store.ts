import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './configuredStore'

export type CoreState = {
  isAppReady: boolean
  blockNumber: number
}

const initialState: CoreState = {
  isAppReady: false,
  blockNumber: 0
}

export const store = createSlice({
  name: 'core',
  initialState,

  reducers: {
    setIsAppReady: (state, { payload: isAppReady }: PayloadAction<CoreState['isAppReady']>): void => {
      state.isAppReady = isAppReady
    },

    setBlockNumber: (state, { payload: blockNumber }: PayloadAction<CoreState['blockNumber']>): void => {
      state.blockNumber = blockNumber
    },

    resetState: () => initialState
  }
})

export const { setIsAppReady, setBlockNumber, resetState } = store.actions

export const selectIsAppReady = (state: RootState): CoreState['isAppReady'] => state.core.isAppReady
export const selectBlockNumber = (state: RootState): CoreState['blockNumber'] => state.core.blockNumber
