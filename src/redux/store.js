import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/userSlice'

const store = configureStore({
  reducer: {
    authReducer,
  },
})

export default store
