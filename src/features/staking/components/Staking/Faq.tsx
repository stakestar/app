import { Typography } from '@onestaree/ui-kit'

import { Collapse } from './Collapse'
import styles from './Faq.module.scss'

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const faq = [
  { title: 'What is StakeStar?', description: loremIpsum },
  { title: 'How does StakeStar work?', description: loremIpsum },
  { title: 'What is ssETH?', description: loremIpsum }
]

export function Faq(): JSX.Element {
  return (
    <div className={styles.Faq}>
      <Typography className={styles.Title} variant="h2">
        FAQ
      </Typography>
      {faq.map(({ title, description }, index) => (
        <Collapse key={index} title={title} description={description} />
      ))}
    </div>
  )
}
