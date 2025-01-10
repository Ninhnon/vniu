import axios, { AxiosInstance } from 'axios'

import { ENV } from '@configs/env'
class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      // baseURL: 'https://vniuapi20240429122410.azurewebsites.net/',
      baseURL: `${ENV.API_URL}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const http = new Http().instance
export default http
