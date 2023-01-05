type ErrorLevel = 'exception' | 'console'

import { toast } from '@onestaree/ui-kit'

interface HandleErrorProps {
  errorLevel?: ErrorLevel
  message?: string
  displayGenericMessage?: boolean
}

export function handleError(error: unknown, props: HandleErrorProps = {}): void {
  const { errorLevel = 'exception', message, displayGenericMessage } = props

  if (message) {
    toast.show(filterMessage(message), 'error', { autoclose: false })
  } else if (displayGenericMessage) {
    toast.show('Something went wrong...', 'error', { autoclose: false })
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

function filterMessage(messageRaw: string): string {
  let message = messageRaw

  if (message.includes('user rejected transaction')) {
    message = 'User rejected transaction'
  }

  return message
}
