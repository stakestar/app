import { Button, Spinner, Typography } from '@onestaree/ui-kit'
import { useEffect, useState } from 'react'

import { appLoadingTimeout, appName } from '../../../config'
import styles from './Loading.module.scss'

export function Loading(): JSX.Element {
  const [isLoadingTimedOut, setIsLoadingTimedOut] = useState(false)
  const [isRestartInProgress, setIsRestartInProgress] = useState(false)

  function onClick(): void {
    setIsRestartInProgress(true)
    window.location.reload()
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoadingTimedOut(true), appLoadingTimeout)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className={styles.Loading}>
      <Spinner type="primary" size={isLoadingTimedOut ? 'large' : 'medium'} centered />
      {isLoadingTimedOut && (
        <div className={styles.LongLoading}>
          <Typography variant="text0">Looks like we can’t connect to the network...</Typography>
          <Button
            className={styles.Button}
            title={`Restart ${appName}`}
            onClick={onClick}
            loading={isRestartInProgress}
          />
        </div>
      )}
    </div>
  )
}
