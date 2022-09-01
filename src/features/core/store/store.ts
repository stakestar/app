import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './configuredStore'

export type CoreState = {
  isAppReady: boolean
}

const initialState: CoreState = {
  isAppReady: false
}

export const store = createSlice({
  name: 'core',
  initialState,

  reducers: {
    setIsAppReady: (state, { payload: isAppReady }: PayloadAction<CoreState['isAppReady']>): void => {
      state.isAppReady = isAppReady
    },

    resetState: () => initialState
  }
})

export const { setIsAppReady, resetState } = store.actions

export const selectIsAppReady = (state: RootState): CoreState['isAppReady'] => state.core.isAppReady
