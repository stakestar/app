import { Action, ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit'

import { store as walletStore } from '~/features/wallet/store'

import { store as coreStore } from './store'

const rootReducer = combineReducers({
  core: coreStore.reducer,
  wallet: walletStore.reducer
})

export const configuredStore = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ thunk: true })
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof configuredStore.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
