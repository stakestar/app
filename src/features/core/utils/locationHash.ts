export function getLocationHash(): string {
  return window.location.hash.slice(1)
}

export function setLocationHash(hash: string | null): void {
  if (hash) {
    window.history.pushState({}, '', `${window.location.origin}${window.location.pathname}#${hash}`)
  } else {
    history.pushState('', document.title, `${window.location.pathname}${window.location.search}`)
  }
}
