import { Typography } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { PropsWithChildren } from 'react'

import styles from './Page.module.scss'

interface PageProps extends PropsWithChildren {
  title?: string
  className?: string
  isVerticalCenter?: boolean
}

export function Page({ title, isVerticalCenter = false, className, children }: PageProps): JSX.Element {
  return (
    <div className={classNames(styles.Page, className, { [styles.isVerticalCenter]: isVerticalCenter })}>
      {title && <Typography variant="h1">{title}</Typography>}
      {children}
    </div>
  )
}
