import { Layout } from './Layout'
import { useListenEvents } from './useListenEvents'

console.info(
  '%c App version hash ',
  'border-radius:3px; font-weight:bold; color:white; background:#1BA5F8',
  process.env.GIT_LAST_COMMIT_HASH
)

export function App(): JSX.Element {
  useListenEvents()

  return <Layout />
}
