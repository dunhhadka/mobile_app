import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types/management'
import { managementApi } from '../../api/magementApi'

type UserState = {
  currentUser: User | null
}

const initialState: UserState = {
  currentUser: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload
    },
    logout: (state) => {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        managementApi.endpoints.createUser.matchFulfilled,
        (state, action) => {
          state.currentUser = action.payload
        }
      )
      .addMatcher(
        managementApi.endpoints.updateUser.matchFulfilled,
        (state, action) => {
          state.currentUser = action.payload
        }
      )
  },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
