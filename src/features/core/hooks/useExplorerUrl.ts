import { useSelector } from '~/features/core'
import { selectWallet } from '~/features/wallet'

import { chainConfigs } from '../config'

export function useExplorerUrl(path: 'address' | 'tx', hash: string): string {
  const { chainId } = useSelector(selectWallet)

  return `${chainConfigs[chainId].explorer}/${path}/${hash}`
}
