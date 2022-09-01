export function copyToClipboard(value: string): void {
  const tempInput = document.createElement('input')

  tempInput.value = value
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)
}
