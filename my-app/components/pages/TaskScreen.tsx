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
import typography from '../../constants/typography'
import layout from '../../constants/layout'
import { gradients, statusColors, colors } from '../../constants/colors'
import { LinearGradient } from 'expo-linear-gradient'
import ProjectCard from '../card/ProjectCard'
import ProjectSummary from '../process/ProjectSummary'
import { ClipboardList } from 'lucide-react-native'
import BaseButton from '../models/BaseButton'
import { useState } from 'react'
import FilterTabs from '../card/FilterTabs'
import BaseModel from '../models/BaseModel'
import CreateOrUpdateProject from './CreateOrUpdateProject'
import { Project, ProjectSearchRequest } from '../../types/management'
import { useSearchProjectQuery } from '../../api/magementApi'
import ProjectDetail from './ProjectDetail'

const TaskScreen = () => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'in_progress' | 'done'
  >('all')

  const [projectUpdateSelected, setProjectUpdateSelected] = useState<
    Project | undefined
  >(undefined)

  const [projetFilter, setProjectFilter] = useState<ProjectSearchRequest>({})

  const [openCreateModel, setOpenCreateModel] = useState(false)

  const [openProjectDetail, setOpenProjectDetail] = useState(false)

  const [projectDetail, setProjectDetail] = useState<Project | undefined>(
    undefined
  )

  const {
    data: projects,
    isLoading: isProjectLoading,
    isFetching: isProjectFetching,
  } = useSearchProjectQuery(projetFilter)

  const handleEditProject = (id: number) => {
    console.log('ProjectId', id)
    const project = projects?.find((p) => p.id === id)
    console.log('Project', project)
    setProjectUpdateSelected(project)
    setOpenCreateModel(true)
  }

  const isCreateLoading = isProjectFetching || isProjectLoading
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#7B5CFF', '#5E3FD9']} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Project List</Text>
              <Text style={styles.subtitle}>Your Projects, Your Vision</Text>
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
            <ProjectSummary />

            <FilterTabs />

            {projects &&
              projects.map((project) => (
                <Pressable
                  key={project.id}
                  onPress={() => {
                    const projectClicked = projects.find(
                      (p) => p.id === project.id
                    )
                    setProjectDetail(projectClicked)
                    setOpenProjectDetail(true)
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
              disabled={isCreateLoading} // Disable nút khi đang submit
            >
              <LinearGradient
                colors={['#7B5AFF', '#4D66F4']}
                style={styles.button}
              >
                {isCreateLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Create Project</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
      {openProjectDetail && projectDetail && (
        <BaseModel
          open={openProjectDetail}
          onClose={() => {
            setOpenProjectDetail(false)
          }}
        >
          <ProjectDetail project_id={projectDetail.id} />
        </BaseModel>
      )}
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
