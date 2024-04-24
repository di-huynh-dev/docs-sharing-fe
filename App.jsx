import Toast, { ErrorToast, SuccessToast } from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { StatusBar } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import AppRouters from './src/navigators/AppRouters'
import 'react-native-gesture-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()
export default function App() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
    },
  }
  const toastConfig = {
    error: (props) => <ErrorToast {...props} text1NumberOfLines={2} />,
    success: (props) => <SuccessToast {...props} text1NumberOfLines={2} />,
  }

  ;<Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <StatusBar style="dark" dark-content />
          <NavigationContainer theme={MyTheme}>
            <AppRouters />
            <StatusBar style="auto" />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </Provider>
      </QueryClientProvider>
    </>
  )
}
