import commonServices from '../apis/commonServices'
import { loginSuccess, removeAuth } from '../redux/reducers/userSlice'
import store from '../redux/store'

const useRefreshToken = () => {
  const refreshToken = store.getState().authReducer.authData.refreshToken
  const refresh = async () => {
    try {
      const resp = await commonServices.refreshToken(refreshToken)
      if (resp.status === 200) {
        store.dispatch(loginSuccess(resp.data.data))
        return resp.data.data.accessToken
      } else {
        store.dispatch(removeAuth())
      }
    } catch (error) {
      console.log(error)
    }
  }
  return refresh
}

export default useRefreshToken
