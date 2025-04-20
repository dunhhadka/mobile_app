type TasksStackParamList = {
  ProjectList: undefined
  ProjectDetail: { project_id: number }
  CreateOrUpdateTask: { projectId: number; taskId?: number }
}

type LeaveStackParamList = {
  LeaveScreen: null
}
