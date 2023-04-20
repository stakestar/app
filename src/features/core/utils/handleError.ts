type ErrorLevel = 'exception' | 'console'

import { toast } from '@onestaree/ui-kit'

interface HandleErrorProps {
  errorLevel?: ErrorLevel
  message?: string
  displayGenericMessage?: boolean
}

export function handleError(error: Error | unknown, props: HandleErrorProps = {}): void {
  const { errorLevel = 'exception', message, displayGenericMessage } = props
  const options = { autocloseTimeout: 30000 }

  if (message?.includes('user rejected transaction')) {
    toast.show('User rejected transaction', 'info', options)
  } else if (displayGenericMessage) {
    toast.show('Something went wrong...', 'error', options)
  } else if (message) {
    toast.show(message, 'error', options)
  }

  if (errorLevel === 'exception') {
    console.error(
      '%c Caught Error ',
      'border-radius:3px; font-weight:bold; color:white; background:red',
      Object.keys(props).length ? { props } : '',
      error
    )
  } else {
    console.warn('%c Caught Error ', 'border-radius:3px; color:#222; background:#ffdc00', { props }, error)
  }
}
