import { useEffect, useMemo, useState } from 'react'

import { getLocalStorageItem, handleError } from '../utils'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const value = useMemo<T>(() => getLocalStorageItem<T>(key, initialValue), [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(value || initialValue)

  const setValue = (newValue: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
      setStoredValue(newValue)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => setStoredValue(value), [value])

  return [storedValue || initialValue, setValue]
}
