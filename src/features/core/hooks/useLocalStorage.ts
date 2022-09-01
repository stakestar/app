import { useEffect, useMemo, useState } from 'react'

import { handleError } from '../utils'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const value: T = useMemo(() => {
    let result

    try {
      const localStorageItem = window.localStorage.getItem(key)

      if (localStorageItem) {
        result = JSON.parse(localStorageItem)
      }
    } catch (error) {
      console.error(handleError)
    }

    return result || initialValue
  }, [initialValue, key])

  const [storedValue, setStoredValue] = useState<T>(value || initialValue)

  const setValue = (newValue: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
      setStoredValue(newValue)
    } catch (error) {
      console.error(handleError)
    }
  }

  useEffect(() => setStoredValue(value), [value])

  return [storedValue || initialValue, setValue]
}
