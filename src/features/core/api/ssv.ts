import axios from 'axios'

const ssvClient = axios.create()

ssvClient.defaults.baseURL = 'https://api.ssv.network/api/v1'

export { ssvClient }
