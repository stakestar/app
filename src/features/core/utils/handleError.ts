type ErrorLevel = 'exception' | 'console'

import { toast } from '@onestaree/ui-kit'

interface HandleErrorProps {
  errorLevel?: ErrorLevel
  message?: string
  displayGenericMessage?: boolean
}

export function handleError(error: unknown, props: HandleErrorProps = {}): void {
  const { errorLevel = 'exception', message, displayGenericMessage } = props

  if (displayGenericMessage) {
    toast.show('Something went wrong...', 'error', { autoclose: false })
  } else if (message) {
    const data = {
      message: message.includes('user rejected transaction') ? 'User rejected transaction' : message,
      options: { autoclose: false }
    }

    toast.show(data.message, 'error', data.options)
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
