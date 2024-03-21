import React, { useEffect, useState } from 'react'
import { Splash } from '../screens'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { useSelector } from 'react-redux'
import { authSelector } from '../redux/reducers/userSlice'

const AppRouters = () => {
  const [isShowSplash, setIsShowSplash] = useState(true)
  const auth = useSelector(authSelector)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])
  return <>{isShowSplash ? <Splash /> : auth.accessToken ? <MainNavigator /> : <AuthNavigator />}</>
}

export default AppRouters
