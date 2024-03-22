import axios from 'axios'
import queryString from 'query-string'
import { appInfo } from '../constants/appInfos'
const BASE_URL = 'http://192.168.1.3:8080/docs-sharing/api/v1'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: (params) => queryString.stringify(params),
})
axiosClient.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axiosClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  },
)

export default axiosClient

export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})
