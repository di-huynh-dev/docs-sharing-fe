import axiosClient from './axiosClient'

const commonServices = {
  refreshToken: (refreshToken) => {
    return axiosClient.post(
      '/auth/refresh',
      { refreshToken },
      {
        withCredentials: true,
      },
    )
  },
}

export default commonServices
