import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { colors } from '../../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'
import ProjectCard from '../card/ProjectCard'
import ProjectSummary from '../process/ProjectSummary'
import { ClipboardList } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import FilterTabs from '../card/FilterTabs'
import BaseModel from '../models/BaseModel'
import CreateOrUpdateProject from './CreateOrUpdateProject'
import { Position, Project, ProjectSearchRequest } from '../../types/management'
import { useSearchProjectQuery } from '../../api/magementApi'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Loading from '../loading/Loading'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

const TaskScreen = () => {
  const [projectUpdateSelected, setProjectUpdateSelected] = useState<
    Project | undefined
  >(undefined)

  const [projetFilter, setProjectFilter] = useState<ProjectSearchRequest>({})

  const [openCreateModel, setOpenCreateModel] = useState(false)

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const isManager =
    currentUser?.position && Position[currentUser.position] === 'Quản lý'

  const {
    data: projects,
    isLoading: isProjectLoading,
    isFetching: isProjectFetching,
    refetch: refetchProjects,
  } = useSearchProjectQuery(projetFilter, { refetchOnMountOrArgChange: true })

  const handleEditProject = (id: number) => {
    const project = projects?.find((p) => p.id === id)
    setProjectUpdateSelected(project)
    setOpenCreateModel(true)
  }

  const navigation = useNavigation<NavigationProp<TasksStackParamList>>()

  const isLoading = isProjectLoading || isProjectFetching

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7B5CFF', '#5E3FD9']} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Danh sách dự án</Text>
              <Text style={styles.subtitle}>Hiển thị tẩt cả dự án của bạn</Text>
            </View>
            <View style={styles.iconContainer}>
              <ClipboardList size={24} color="white" />
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <ProjectSummary projects={projects || []} />

            <FilterTabs
              changeFilter={(s) => {
                setProjectFilter((prev) => ({
                  ...prev,
                  statuses:
                    s === 'all'
                      ? []
                      : s === 'in_progress'
                      ? ['in_process']
                      : ['finish'],
                }))
                refetchProjects()
              }}
            />

            {projects &&
              projects.map((project) => (
                <Pressable
                  key={project.id}
                  onPress={() => {
                    navigation.navigate('ProjectDetail', {
                      project_id: project.id,
                    })
                  }}
                >
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                  />
                </Pressable>
              ))}
          </ScrollView>
          {isManager && (
            <View
              style={{
                backgroundColor: 'white',
                paddingLeft: 8,
                paddingRight: 8,
              }}
            >
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => setOpenCreateModel(true)}
                disabled={isLoading} // Disable nút khi đang submit
              >
                <LinearGradient
                  colors={['#7B5AFF', '#4D66F4']}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Tạo dự án</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
      {openCreateModel && (
        <BaseModel
          open={openCreateModel}
          onClose={() => {
            setOpenCreateModel(false)
            setProjectUpdateSelected(undefined)
          }}
        >
          <CreateOrUpdateProject
            onClose={() => {
              setOpenCreateModel(false)
              setProjectUpdateSelected(undefined)
            }}
            project={projectUpdateSelected}
          />
        </BaseModel>
      )}
      {isLoading && <Loading />}
    </View>
  )
}

export default TaskScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
  },
})
