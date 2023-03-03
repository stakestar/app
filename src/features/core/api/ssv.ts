import axios from 'axios'

const ssvClient = axios.create()

ssvClient.defaults.baseURL = 'https://api.ssv.network/api/v2/prater'

export { ssvClient }
