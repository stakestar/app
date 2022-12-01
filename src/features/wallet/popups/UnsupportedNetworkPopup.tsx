import styles from './UnsupportedNetworkPopup.module.scss'

export function UnsupportedNetworkPopup(): JSX.Element {
  return (
    <div className={styles.UnsupportedNetworkPopup}>
      <p>Please check your Network config.</p>
      <p>
        StakeStar works only on <b>Ethereum Mainnet</b>.
      </p>
    </div>
  )
}
