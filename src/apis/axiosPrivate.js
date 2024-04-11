import { axiosPrivate } from './axiosClient'
import { useEffect } from 'react'
import store from '../redux/store'

const useAxiosPrivate = () => {
  const token = store.getState().authReducer.authData.accessToken

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        const newConfig = { ...config }
        console.log(token)
        if (token) {
          newConfig.headers['Authorization'] = `Bearer ${token}`
        }
        return newConfig
      },
      (error) => Promise.reject(error),
    )
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept)
    }
  }, [token])
}

export default useAxiosPrivate
