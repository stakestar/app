import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux'

import { RootState } from '../store'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
