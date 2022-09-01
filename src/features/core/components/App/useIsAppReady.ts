import { useEffect } from 'react'

import { useDispatch } from '../../hooks'
import { setIsAppReady } from '../../store'

export function useIsAppReady(): void {
  const dispatch = useDispatch()
  // const [isWalletReady, setIsWalletReady] = useState(false)

  // useEventListener(EVENT_WALLET_IS_READY, () => setIsWalletReady(true))

  useEffect(() => {
    // if (isWalletReady) {
    dispatch(setIsAppReady(true))

    // }
  }, [dispatch])
}
