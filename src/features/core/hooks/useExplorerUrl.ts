import { useSelector } from '~/features/core'
import { selectWallet } from '~/features/wallet'

import { supportedChains } from '../config'

export function useExplorerUrl(path: 'address' | 'tx', hash: string): string {
  const { chainId } = useSelector(selectWallet)

  return `${supportedChains[chainId].explorer}/${path}/${hash}`
}
