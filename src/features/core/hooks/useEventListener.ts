import { useEffect } from 'react'

export function useEventListener<T>(eventName: string, callback: (data: T) => void): void {
  useEffect(() => {
    const handler = (event: CustomEvent | Event): void => callback((event as CustomEvent).detail)

    window.addEventListener(eventName, handler, false)

    return (): void => {
      window.removeEventListener(eventName, handler, false)
    }
  }, [eventName, callback])
}
