import { ForgetPassword, NewPassword, OTP, Signup } from '../screens'
import Login from '../screens/auth/Login'
import Onboarding from '../screens/auth/Onboarding'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const AuthNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="NewPassword" component={NewPassword} />
      <Stack.Screen name="OTP" component={OTP} />
    </Stack.Navigator>
  )
}

export default AuthNavigator
