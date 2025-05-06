import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import { Image } from 'expo-image'
import { Bell, MessageSquare, CheckCircle } from 'lucide-react-native'
import SummaryCard from '../card/SummaryCard'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import colors from '../../constants/colors'
import {
  useGetMessageAndNotificationUnreadQuery,
  useSearchProjectQuery,
} from '../../api/magementApi'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Loading from '../loading/Loading'
import { Position, ProjectSearchRequest } from '../../types/management'
import ProjectCard from '../card/ProjectCard'
import EmptySearchResult from '../models/EmptySearchResult'
import { useGetCurrentUser } from '../../utils/getCurrentUser'

export default function HomeScreen() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser)

  const [currentTime, setCurrentTime] = useState('')

  const navigation = useNavigation()

  const { isManager } = useGetCurrentUser()

  const projectFilter: ProjectSearchRequest = {
    createdIds: isManager ? [currentUser?.id ?? 0] : [],
    processIds: !isManager ? [currentUser?.id ?? 0] : [],
  }

  const {
    data: projects,
    isLoading: isProjectLoading,
    isFetching: isProjectFetching,
  } = useSearchProjectQuery(projectFilter, { refetchOnMountOrArgChange: true })

  const {
    data: countData,
    isLoading: isCountLoading,
    refetch,
  } = useGetMessageAndNotificationUnreadQuery(currentUser?.id ?? 0)

  const { unReadMessage, unReadNotification } = countData ?? {}

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  )

  const isLoading = isCountLoading || isProjectLoading || isProjectFetching

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            {currentUser?.avatar?.src ? (
              <Image
                source={{
                  uri: currentUser.avatar.src,
                }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={{ fontSize: 20 }}>
                  {currentUser?.user_name?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{currentUser?.user_name ?? ''}</Text>
                <CheckCircle
                  size={16}
                  color="#6c5ce7"
                  style={styles.verifiedIcon}
                />
              </View>
              <Text style={styles.role}>
                {currentUser?.position
                  ? Position[currentUser.position]
                  : 'Chưa có vị trí'}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconButton}
              // @ts-ignore
              onPress={() => navigation.navigate('ChatList')}
            >
              <MessageSquare size={20} color="#6c5ce7" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {unReadMessage ?? 0}
                </Text>
                {/* Số tin nhắn chưa đọc */}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Notification')
              }}
            >
              <Bell size={20} color="#6c5ce7" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {unReadNotification ?? 0}
                </Text>
                {/* Số tin nhắn chưa đọc */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard
          title={`Chào mừng trở lại, ${currentUser?.user_name ?? ''}`}
          subtitle="Cùng xem hôm nay bạn có cuộc họp và nhiệm vụ nào."
        />
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {!isManager
                ? 'Các dự án bạn đang tham gia'
                : 'Bạn đang quản lý các dự án sau'}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {projects && projects.length}
              </Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Danh sách dự án</Text>
          {projects && projects.length ? (
            projects?.map((project, index) => (
              <Pressable
                key={index}
                style={{ marginTop: 10 }}
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('Tasks', {
                    screen: 'ProjectDetail',
                    params: { project_id: project.id },
                  })
                }}
              >
                <ProjectCard project={project} onEdit={() => {}} />
              </Pressable>
            ))
          ) : (
            <EmptySearchResult
              title={`${
                isManager
                  ? 'Bạn chưa quản lý dự án nào.'
                  : 'Bạn chưa dược vào dự án nào.'
              }`}
              subtitle={`${
                isManager ? 'Hãy tạo dự án dầu tiên' : 'Hãy tìm dự án phù hợp'
              }`}
            />
          )}
          <View style={styles.meetingsContainer}></View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
      {isLoading && <Loading />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signalIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 12,
    gap: 1,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#333',
    borderRadius: 1,
  },
  signalBar1: { height: 3 },
  signalBar2: { height: 6 },
  signalBar3: { height: 9 },
  signalBar4: { height: 12 },
  wifiIcon: {
    position: 'relative',
    width: 15,
    height: 12,
  },
  wifiCircle: {
    position: 'absolute',
    bottom: 0,
    left: 6,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#333',
  },
  wifiWave1: {
    position: 'absolute',
    bottom: 2,
    left: 3,
    width: 9,
    height: 4.5,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#333',
  },
  wifiWave2: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    width: 15,
    height: 7.5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: '#333',
  },
  batteryIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryBody: {
    width: 20,
    height: 10,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 2,
    backgroundColor: '#333',
  },
  batteryHead: {
    width: 2,
    height: 4,
    backgroundColor: '#333',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  role: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  section: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  meetingsContainer: {
    marginTop: 16,
    gap: 12,
  },
  tasksContainer: {
    marginTop: 16,
  },
  bottomPadding: {
    height: 100,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.primary, // Màu nền cho số tin nhắn
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: colors.white, // Màu chữ của số tin nhắn
    fontSize: 10,
    fontWeight: 'bold',
  },
})
