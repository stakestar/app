export function emitEvent<T>(eventName: string, data?: T): void {
  window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
}
