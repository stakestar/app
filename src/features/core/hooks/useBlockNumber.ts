import { useSelector } from '../hooks'
import { selectBlockNumber } from '../store'

export function useBlockNumber(): number {
  return useSelector(selectBlockNumber)
}
