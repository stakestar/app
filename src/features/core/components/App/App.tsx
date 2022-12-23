import { Layout } from './Layout'
import { useListenEvents } from './useListenEvents'

console.info(
  '%c App version hash ',
  'border-radius:3px; font-weight:bold; color:white; background: linear-gradient(93.28deg, #E61F59 -3%, #FA4845 99.13%)',
  process.env.GIT_LAST_COMMIT_HASH
)

export function App(): JSX.Element {
  useListenEvents()

  return <Layout />
}
