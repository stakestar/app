import { handleError } from './handleError'

export function getLocalStorageItem<T>(key: string, initialValue: T): T {
  let result

  try {
    const localStorageItem = window.localStorage.getItem(key)

    if (localStorageItem) {
      result = JSON.parse(localStorageItem)
    }
  } catch (error) {
    handleError(error)
  }

  return result || initialValue
}
