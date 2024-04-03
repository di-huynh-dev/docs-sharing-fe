import React, { useEffect, useState } from 'react'
import { Splash } from '../screens'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { addProfile, authSelector } from '../redux/reducers/userSlice'
import userServices from '../apis/userServices'
import AdminMainNavigator from './AdminMainNavigator'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)

  const dispatch = useDispatch()
  const auth = useSelector(authSelector)
  console.log('auth', auth)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [auth.accessToken])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Kiểm tra xem đã có token chưa
        if (auth.accessToken) {
          // Gọi API để lấy thông tin profile
          const response = await userServices.getProfile(auth.accessToken)
          // Lưu thông tin profile vào store Redux
          dispatch(addProfile(response.data))
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
        // Xử lý lỗi ở đây nếu cần thiết
      }
    }
    fetchUserProfile()
  }, [auth.accessToken])

  // Kiểm tra xem người dùng có vai trò admin hay không
  const isAdmin = auth.profile?.role.roleName === 'ROLE_ADMIN'

  // Kiểm tra nếu người dùng là admin thì hiển thị AdminNavigator
  // if (isAdmin) {
  //   return <>{isShowSplash ? <Splash /> : auth.accessToken ? <AdminMainNavigator /> : <AuthNavigator />}</>
  // }

  // Nếu không phải admin thì hiển thị MainNavigator
  return <>{isShowSplash ? <Splash /> : auth.accessToken ? <AdminMainNavigator /> : <AuthNavigator />}</>
}

export default AppRouters
