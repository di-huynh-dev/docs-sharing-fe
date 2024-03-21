import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authData: {
      accessToken: null,
      refreshToken: null,
    },
    profile: {
      data: null,
    },
  },
  reducers: {
    loginSuccess: (state, action) => {
      ;(state.authData.accessToken = action.payload.accessToken),
        (state.authData.refreshToken = action.payload.refreshToken)
    },
    addProfile: (state, action) => {
      state.authData.profile = action.payload.data
    },
    removeAuth: (state, action) => {
      state.authData = null
    },
  },
})

export const { loginSuccess, addProfile, removeAuth } = authSlice.actions

export const authReducer = authSlice.reducer

export const authSelector = (state) => state.authReducer.authData
