import classNames from 'classnames'
import { PropsWithChildren, ReactNode, useEffect, useId, useState } from 'react'
import ReactTooltip from 'react-tooltip'

import styles from './Tooltip.module.scss'

export interface TooltipProps extends PropsWithChildren {
  value: ReactNode
  disabled: boolean
  className?: string
}

export function Tooltip({ value, disabled, className, children }: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false) // Because of https://stackoverflow.com/a/73197730
  const id = useId().replaceAll(':', '')

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [isVisible])

  return (
    <div className={classNames(styles.Tooltip, className)}>
      <div
        className={styles.Container}
        data-for={id}
        data-tip={true}
        onMouseEnter={(): void => setIsVisible(true)}
        onMouseLeave={(): void => setIsVisible(false)}
      >
        {children}
      </div>
      <div className={classNames(styles.Content, { [styles.visible]: isVisible && !disabled })}>
        <ReactTooltip className={classNames(styles.Value)} id={id} place="top" effect="solid">
          {value}
        </ReactTooltip>
      </div>
    </div>
  )
}
