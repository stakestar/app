import { Container, Icon, Typography, useTheme } from '@onestaree/ui-kit'
import classNames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './Collapse.module.scss'

interface CollapseProps {
  title: string
  description: string
}

export function Collapse({ title, description }: CollapseProps): JSX.Element {
  const { theme } = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const onClick = useCallback(() => setIsActive((value) => !value), [])
  const getMaxHeight = useCallback(() => ref.current && setMaxHeight(ref.current.scrollHeight), [ref])

  useEffect(() => {
    window.addEventListener('resize', getMaxHeight)
    getMaxHeight()

    return () => window.removeEventListener('resize', getMaxHeight)
  }, [getMaxHeight, ref])

  return (
    <Container className={classNames(styles.Collapse, { [styles.active]: isActive })} size="large">
      <div className={styles.Title} onClick={onClick}>
        <Typography variant="h3">{title}</Typography>
        <Icon className={styles.Icon} icon="back" fillColor={theme.text} />
      </div>
      <div className={styles.Content} style={{ height: isActive ? maxHeight : 0 }} ref={ref}>
        <Typography className={styles.Description}>{description}</Typography>
      </div>
    </Container>
  )
}
