type ErrorLevel = 'exception' | 'console'

import { toast } from '@onestaree/ui-kit'

interface HandleErrorProps {
  errorLevel?: ErrorLevel
  message?: string
  displayGenericMessage?: boolean
}

export function handleError(error: Error | unknown, props: HandleErrorProps = {}): void {
  const { errorLevel = 'exception', message, displayGenericMessage } = props

  if (message?.includes('user rejected transaction')) {
    toast.show('User rejected transaction', 'info', { autocloseTimeout: 3000 })
  } else if (displayGenericMessage) {
    toast.show('Something went wrong...', 'error', { autocloseTimeout: 5000 })
  } else if (message) {
    toast.show(message, 'error', { autoclose: false })
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
