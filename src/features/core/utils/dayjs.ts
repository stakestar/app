import dayjsRaw from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjsRaw.extend(advancedFormat)
dayjsRaw.extend(localeData)
dayjsRaw.extend(localizedFormat)
dayjsRaw.extend(relativeTime)

export const dayjs = dayjsRaw

export function formatDate(date: string | number): string {
  const locale = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language

  const { format } = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  return format(dayjs(typeof date === 'number' ? date * 1000 : date).toDate())
}
