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
  ChatMember,
  ChatRoom,
  Comment,
  DailyReport,
  DailyReportRequest,
  LoginRequest,
  LogResponse,
  Message,
  Notification,
  Project,
  ProjectRequest,
  ProjectSearchRequest,
  Task,
  TaskFilterRequest,
  TaskRequest,
  User,
  UserFilterRequest,
  UserRequest,
} from '../types/management'

export const URL = 'http://192.168.100.8:8080'

export const managementApi = createApi({
  reducerPath: 'managementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  tagTypes: ['project', 'notification', 'task'],
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
    clockIn: builder.mutation<LogResponse, FormData>({
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
      providesTags: (result) =>
        result ? [{ type: 'task', id: result.id }] : [],
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
    getCommentsByTaskId: builder.query<Comment[], number>({
      query: (id) => ({
        url: `/api/comments/${id}/comments`,
        method: 'GET',
      }),
    }),
    startTaskById: builder.mutation<void, { taskId: number; userId: number }>({
      query: ({ taskId, userId }) => ({
        url: `/api/tasks/${taskId}/current-user/${userId}/start`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg, meta) => {
        return !error ? [{ type: 'task', id: arg.taskId }] : []
      },
    }),
    finishTaskById: builder.mutation<void, { taskId: number; userId: number }>({
      query: ({ taskId, userId }) => ({
        url: `/api/tasks/${taskId}/current-user/${userId}/finish`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg, meta) => {
        return !error ? [{ type: 'task', id: arg.taskId }] : []
      },
    }),
    createDailyReport: builder.mutation<DailyReport, DailyReportRequest>({
      query: (request) => ({
        url: `/api/daily-reports`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: (result, error, arg, meta) => {
        return !error ? [{ type: 'task', id: arg.task_id }] : []
      },
    }),
    getDailyReportByTaskId: builder.query<DailyReport[], number>({
      query: (id) => ({
        url: `/api/daily-reports/task/${id}`,
        method: 'GET',
      }),
    }),
    reOpenTaskById: builder.mutation<void, { taskId: number; userId: number }>({
      query: ({ taskId, userId }) => ({
        url: `/api/tasks/${taskId}/current-user/${userId}/reopen`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, arg, meta) => {
        return !error ? [{ type: 'task', id: arg.taskId }] : []
      },
    }),
    filterTasks: builder.query<Task[], TaskFilterRequest>({
      query: (request) => {
        console.log(request)
        return {
          url: `/api/tasks/filter`,
          method: 'GET',
          params: { ...request },
        }
      },
      providesTags: (result, error, arg, meta) => {
        return result && result.length
          ? [
              ...result.map((r) => ({ type: 'task' as const, id: r.id })),
              { type: 'task' as const, id: 'LIST' },
            ]
          : [{ type: 'task' as const, id: 'LIST' }]
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
  useGetChatMemberByUserIdQuery,
  useGetRoomByIdQuery,
  useGetMessageByRoomIdQuery,
  useGetNotificationByUserIdQuery,
  useMarkIsReadMutation,
  useGetMessageAndNotificationUnreadQuery,
  useGetTasksByUserIdQuery,
  useGetCommentsByTaskIdQuery,
  useStartTaskByIdMutation,
  useFinishTaskByIdMutation,
  useCreateDailyReportMutation,
  useGetDailyReportByTaskIdQuery,
  useGetTaskByIdQuery,
  useReOpenTaskByIdMutation,
  useFilterTasksQuery,
} = managementApi
