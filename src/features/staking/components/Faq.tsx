import { Typography } from '@onestaree/ui-kit'

import { Collapse } from './Collapse'
import styles from './Faq.module.scss'

const faq = [
  {
    title: 'What is the StakeStar application?',
    description: `StakeStar is a decentralized staking application built on top of the SSV network. 
      StakeStar allows users to pool and stake their Eth in a secure way.`
  },
  {
    title: 'How is StakeStar different from other staking pools?',
    description: `The StakeStar application is built on top of the SSV network which has developed Distributed 
      Validator Technology (DVT). DVT enables trustless staking through multi-operator validation. 
      In simple words, DVT ensures that no single party has access to your funds through the validator's private keys.`
  },
  {
    title: 'How does StakeStar work?',
    description: `
    The StakeStar application works similarly to other staking pool solutions. Users can stake their 
    Eth through the Staking page and will get a receipt token sstarETH in return. Later, after the Ethereum 
    network enables withdrawals, users will be able to unstake their Eth alongside with accumulated rewards.
    <br /><br />
    It is worth noting that StakeStar doesn't aim to be a liquid staking solution. That means StakeStar 
    doesn't maintain liquidity pools of sstarETH/ETH assets on DEXes.`
  }
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
