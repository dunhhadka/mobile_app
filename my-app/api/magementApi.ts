import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { LogResponse, User, UserRequest } from '../types/management'

export const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.31.117:8080',
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation<User, UserRequest>({
      query: (request) => ({
        url: '/api/users/sign-up',
        method: 'POST',
        body: request,
      }),
    }),
    updateUser: builder.mutation<User, UserRequest>({
      query: (request) => ({
        url: `/api/users/update/${request.id}`,
        method: 'PUT',
        body: request,
      }),
    }),
    uploadUserAvatar: builder.mutation<User, { userId: number, formData: FormData }>
      ({
        query: ({ userId, formData }) => ({
          url: `/api/users/${userId}/upload`,
          method: 'POST',
          body: formData,
        }),
      }),
    clockIn: builder.mutation<LogResponse, FormData>
    ({
        query: (formData) => ({
          url: `/api/attendances/logs`,
          method: 'POST',
          body: formData
        })
    })
  }),
})

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
  useClockInMutation,
} = managementApi
