import { configureStore } from '@reduxjs/toolkit'
import { managementApi } from '../api/magementApi'
import userReducer from '../redux/slices/userSlice'

export const store = configureStore({
  reducer: {
    [managementApi.reducerPath]: managementApi.reducer,
    user: userReducer, // userReducer cần được khai báo đúng
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(managementApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
