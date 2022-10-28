import BigNumber from 'bignumber.js'

export function formatNumber(value: number | string, minimumFractionDigits = 2): string {
  return new Intl.NumberFormat(window.navigator.language, { minimumFractionDigits }).format(
    typeof value === 'string' ? parseFloat(value) : value
  )
}

export function formatNumberDecimals(value: number | string, decimals: number): string {
  return (
    Math.floor((typeof value === 'number' ? value : parseFloat(value)) * 10 ** decimals) /
    10 ** decimals
  ).toFixed(decimals)
}

export function formatNumberToShortForm(value: number | string): string {
  const valueToFormat = typeof value === 'number' ? value : parseFloat(value)
  const abbreviations = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  const index = valueToFormat > 0 ? Math.floor(Math.log(valueToFormat) / Math.log(1000)) : 0
  const result = formatNumber(formatNumberDecimals(valueToFormat / Math.pow(1000, index), 2))

  return `${result}${abbreviations[index > 0 ? index : 0]}`
}
