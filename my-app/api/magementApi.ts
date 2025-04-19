import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from '@reduxjs/toolkit/query/react'
import {
  AggregateLogRequest,
  AttendanceResponse,
  ChatMember,
  ChatRoom,
  LoginRequest,
  LogResponse,
  Message,
  Notification,
  Project,
  ProjectRequest,
  ProjectSearchRequest,
  Task,
  TaskRequest,
  User,
  UserFilterRequest,
  UserRequest,
} from '../types/management'

export const URL = 'http://192.168.31.117:8080'

export const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  tagTypes: ['project', 'notification', 'task', 'attendances'],
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
    uploadLog: builder.mutation<LogResponse, FormData>({
      query: (formData) => ({
        url: `/api/attendances/logs`,
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
    getChatMemberByUserId: builder.query<ChatMember[], number>({
      query: (id) => ({
        url: `/api/chats/members/${id}`,
        method: 'GET',
      }),
    }),
    getRoomById: builder.query<ChatRoom, number>({
      query: (id) => ({
        url: `/api/chats/rooms/${id}`,
        method: 'GET',
      }),
    }),
    getMessageByRoomId: builder.query<Message[], number>({
      query: (id) => ({
        url: `/api/chats/rooms/${id}/messages`,
        method: 'GET',
      }),
    }),
    getNotificationByUserId: builder.query<Notification[], number>({
      query: (id) => ({
        url: `/api/notifications/${id}`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result && result.length > 0
          ? [
            ...result.map((r) => ({
              type: 'notification' as const,
              id: r.id,
            })),
            { type: 'notification' as const, id: 'LIST' },
          ]
          : [{ type: 'notification' as const, id: 'LIST' }],
    }),
    markIsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/notifications/${id}/mark-as-read`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg, meta) => [
        { type: 'notification', id: 'LIST' },
      ],
    }),
    getMessageAndNotificationUnread: builder.query<
      { unReadMessage: number; unReadNotification: number },
      number
    >({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const [msgResult, notiResult] = await Promise.all([
          baseQuery({ url: `/api/messages/${arg}/un-read` }),
          baseQuery({ url: `/api/notifications/${arg}/un-read` }),
        ])

        if (msgResult.error || notiResult.error) {
          return {
            error: msgResult.error || notiResult.error,
          } as QueryReturnValue<
            { unReadMessage: number; unReadNotification: number },
            FetchBaseQueryError,
            FetchBaseQueryMeta
          >
        }

        return {
          data: {
            unReadMessage: msgResult.data as number,
            unReadNotification: notiResult.data as number,
          },
        } as QueryReturnValue<
          { unReadMessage: number; unReadNotification: number },
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >
      },
    }),
    getTasksByUserId: builder.query<Task[], number>({
      query: (id) => ({ url: `/api/tasks/${id}/current-tasks`, method: 'GET' }),
      providesTags: (result) => {
        return result && result.length
          ? [
            ...result.map((r) => ({ type: 'task' as const, id: r.id })),
            { type: 'task' as const, id: 'LIST' },
          ]
          : [{ type: 'task' as const, id: 'LIST' }]
      },
    }),
    getLogsByDate: builder.query<LogResponse[], {userId: number, date: string}>({
      query: ({userId, date}) => {
        return ({
          url: `/api/attendances/logs/${userId}?date=${date}`,
          method: 'GET',
        })
      }
    }),
    uploadAggregateLogRequest: builder.mutation<AttendanceResponse, AggregateLogRequest>(
      {
        query: (request) => ({
          url: `/api/attendances/aggregate`,
          method: 'POST',
          body: request
        })
      }),
    getAttendanceByUserId: builder.query<AttendanceResponse[], number>(
      {
        query: (userId) => ({
          url: `/api/attendances/${userId}`,
          method: 'GET',
        })
      }
    )
  }),
})

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useUploadUserAvatarMutation,
  useUploadLogMutation,
  useGetLogsByDateQuery,
  useUploadAggregateLogRequestMutation,
  useGetAttendanceByUserIdQuery,
  useSignInMutation,
  useFilterUserQuery,
  useCreateProjectMutation,
  useSearchProjectQuery,
  useUpdateProjectMutation,
  useCreateTaskMutation,
  useGetProjectByIdQuery,
  useLazyGetTaskByIdQuery,
  useUpdateTaskMutation,
  useGetChatMemberByUserIdQuery,
  useGetRoomByIdQuery,
  useGetMessageByRoomIdQuery,
  useGetNotificationByUserIdQuery,
  useMarkIsReadMutation,
  useGetMessageAndNotificationUnreadQuery,
  useGetTasksByUserIdQuery,
} = managementApi
