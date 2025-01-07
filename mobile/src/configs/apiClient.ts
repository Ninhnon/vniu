// axiosConfig.js
import axios from 'axios'

import { ENV } from './env'
import { getStringStorage } from 'src/functions/storageFunctions'

const accessToken = getStringStorage('accessToken')

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }
})

apiClient.interceptors.request.use(
  function (config) {
    // console.log('request', `${ENV.API_URL}${config.url}`, config.data, config.params)
    // const curl = toCurl(config);
    // console.log('cURL:', curl);
    return config
  },
  function (error) {
    // console.error('Request errors', error)

    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  function (response) {
    console.log('🚀 ~ response:', response)
    return response
  },
  function (error) {
    console.log('🚀 ~ error:', error)
    // if (serverErrorStatuses.includes(error.response.status)) {
    //   // showToast('error', 'Connection Error. Please Try Again');
    // }
    return Promise.reject(error)
  }
)
