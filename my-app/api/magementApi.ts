import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import {
  LoginRequest,
  Project,
  ProjectRequest,
  ProjectSearchRequest,
  Task,
  TaskRequest,
  User,
  UserFilterRequest,
  UserRequest,
} from '../types/management'

export const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.31.117:8080',
  }),
  tagTypes: ['project'],
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
    uploadUserAvatar: builder.mutation<
      User,
      { userId: number; formData: FormData }
    >({
      query: ({ userId, formData }) => ({
        url: `/api/users/${userId}/upload`,
        method: 'POST',
        body: formData,
      }),
    }),
    signIn: builder.mutation<User, LoginRequest>({
      query: (request) => ({
        url: '/api/users/login',
        method: 'POST',
        body: request,
      }),
    }),
    filterUser: builder.query<User[], UserFilterRequest>({
      query: (request) => ({
        url: '/api/users/filter',
        method: 'POST',
        body: request,
      }),
    }),
    createProject: builder.mutation<Project, ProjectRequest>({
      query: (request) => ({
        url: '/api/projects',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: [{ type: 'project', id: 'LIST' }],
    }),
    searchProject: builder.query<Project[], ProjectSearchRequest>({
      query: (params) => ({
        url: 'api/projects/search',
        method: 'GET',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'project' as const, id })),
              { type: 'project', id: 'LIST' },
            ]
          : [{ type: 'project', id: 'LIST' }],
    }),
    updateProject: builder.mutation<Project, ProjectRequest>({
      query: (request) => ({
        url: `/api/projects/${request.id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags: [{ type: 'project', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, TaskRequest>({
      query: (request) => ({
        url: `/api/tasks`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: (result, error, request) => {
        if (error) return [{ type: 'project', id: 'LIST' }]
        return [{ type: 'project', id: result?.project_id }]
      },
    }),
    getProjectById: builder.query<Project, number>({
      query: (id) => ({
        url: `/api/projects/${id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result ? [{ type: 'project', id: result.id }] : [],
    }),
    getTaskById: builder.query<Task, number>({
      query: (id) => ({
        url: `/api/tasks/${id}`,
        method: 'GET',
      }),
    }),
    updateTask: builder.mutation<Task, TaskRequest>({
      query: (request) => ({
        url: `/api/tasks/${request.id}`,
        method: 'PUT',
        body: request,
      }),
      invalidatesTags(result, error, arg, meta) {
        if (error) return [{ type: 'project', id: 'LIST' }]
        return [{ type: 'project', id: result?.project_id }]
      },
    }),
  }),
})

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
  useClockInMutation,
  useSignInMutation,
  useFilterUserQuery,
  useCreateProjectMutation,
  useSearchProjectQuery,
  useUpdateProjectMutation,
  useCreateTaskMutation,
  useGetProjectByIdQuery,
  useLazyGetTaskByIdQuery,
  useUpdateTaskMutation,
} = managementApi
