import axios, { Axios } from 'axios'
import { useMemo } from 'react'

import { useChainConfig } from '~/features/wallet'

export function useSSVClient(): Axios {
  const chainConfig = useChainConfig()

  return useMemo(() => {
    const ssvClient = axios.create()
    ssvClient.defaults.baseURL = chainConfig.ssvApiUrL

    return ssvClient
  }, [chainConfig])
}
