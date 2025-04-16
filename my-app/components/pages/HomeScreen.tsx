import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Image } from 'expo-image'
import { Bell, MessageSquare, CheckCircle } from 'lucide-react-native'
import SummaryCard from '../card/SummaryCard'
import EmptyCard from '../card/EmptyCard'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../App'

// Mock Data
export const meetings = [
  {
    id: '1',
    title: 'Townhall Meeting',
    startTime: '01:30 AM',
    endTime: '02:00 AM',
    participants: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '3',
        avatar:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
      },
    ],
    extraParticipants: 3,
  },
  {
    id: '2',
    title: 'Dashboard Report',
    startTime: '01:30 AM',
    endTime: '02:00 AM',
    participants: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '4',
        avatar:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      },
    ],
  },
]

export const tasks = [
  {
    id: '1',
    title: 'Wiring Dashboard Analytics',
    status: 'In Progress' as const,
    priority: 'High' as const,
    dueDate: '27 April',
    count: 2,
    assignees: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      },
      {
        id: '3',
        avatar:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop',
      },
    ],
  },
]

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState('')

  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()

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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&auto=format&fit=crop',
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>Tonald Drump</Text>
                <CheckCircle
                  size={16}
                  color="#6c5ce7"
                  style={styles.verifiedIcon}
                />
              </View>
              <Text style={styles.role}>Junior Full Stack Developer</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('ChatList')}
            >
              <MessageSquare size={20} color="#6c5ce7" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                navigation.navigate('Notification')
              }}
            >
              <Bell size={20} color="#6c5ce7" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header tích hợp ở đây luôn */}

        <SummaryCard />

        {/* <SummaryCard /> */}

        {/* Meetings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today Meeting</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{meetings.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Your schedule for the day</Text>

          <View style={styles.meetingsContainer}>
            {meetings.map((meeting, index) => (
              <Text>Meeting</Text>
              // <MeetingItem key={index} meeting={meeting} />
            ))}
          </View>
          <EmptyCard />
        </View>

        {/* Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today Task</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tasks.length}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>
            The tasks assigned to you for today
          </Text>

          <View style={styles.tasksContainer}>
            {tasks.map((task, index) => (
              <Text>Task Item</Text>
              // <TaskItem key={index} task={task} />
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 10,
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
})
