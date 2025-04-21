// App.tsx

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import { Bell, Calendar, Home, ListChecks, User } from 'lucide-react-native'
import { Provider } from 'react-redux'
import { store } from './store/store'

// Screens
import HomeScreen from './components/pages/HomeScreen'
import TaskScreen from './components/pages/TaskScreen'
import CalendarScreen from './components/pages/CalendarScreen'
import NotificationsScreen from './components/pages/NotificationScreen'
import ProfileScreen from './components/pages/ProfileScreen'
import SignInScreen from './components/pages/SignInScreen'
import SignUpScreen from './components/pages/SignUpScreen'
import OnboardScreen from './components/pages/OnboardScreen'
import { ToastProvider } from 'react-native-toast-notifications'
import CustomToast from './components/layouts/CustomToast'
import ProjectDetail from './components/pages/ProjectDetail'
import ChatListScreen from './components/pages/ChatListScreen'
import ChatRoomScreen from './components/pages/ChatRoomScreen'
import NotificationProvider from './provider/NotificationProvider'
import Toast from 'react-native-toast-message'
import CustomNotificationToast from './components/CustomNotificationToast'
import CreateOrUpdateTaskFrom from './components/form/CreateOrUpdateTaskFrom'

// Param types for Task stack
export type TasksStackParamList = {
  ProjectList: undefined
  ProjectDetail: { project_id: number }
  CreateOrUpdateTask: { projectId: number; taskId?: number }
}

export type HomeStackParamList = {
  Home: undefined
  Notification: undefined
  ChatList: undefined
  ChatRoom: { room_id: number; member_id: number }
}
const HomeStack = createNativeStackNavigator<HomeStackParamList>()
function HomesStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notification" component={NotificationsScreen} />
      <HomeStack.Screen name="ChatList" component={ChatListScreen} />
      <HomeStack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </HomeStack.Navigator>
  )
}

// Main navigators
const RootStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const TaskStack = createNativeStackNavigator<TasksStackParamList>()

function TasksStack() {
  return (
    <TaskStack.Navigator screenOptions={{ headerShown: false }}>
      <TaskStack.Screen name="ProjectList" component={TaskScreen} />
      <TaskStack.Screen name="ProjectDetail" component={ProjectDetail} />
      <TaskStack.Screen
        name="CreateOrUpdateTask"
        component={CreateOrUpdateTaskFrom}
      />
    </TaskStack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 5 },
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home size={size} color={color} />
            case 'Calendar':
              return <Calendar size={size} color={color} />
            case 'Notification':
              return <Bell size={size} color={color} />
            case 'Profile':
              return <User size={size} color={color} />
            case 'Tasks':
              return <ListChecks size={size} color={color} />
            default:
              return null
          }
        },
        tabBarActiveTintColor: '#6C47FF',
        tabBarInactiveTintColor: '#777',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomesStack}
        options={
          {
            unmountOnBlur: true,
          } as BottomTabNavigationOptions
        }
      />
      <Tab.Screen name="Tasks" component={TasksStack} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NotificationProvider>
        <ToastProvider
          renderToast={({ type, message }) => (
            <CustomToast
              type={(type as 'success' | 'error' | 'info') || 'info'}
              message={typeof message === 'string' ? message : ''}
            />
          )}
          placement="top"
          offsetTop={25}
          animationType="slide-in"
          swipeEnabled={true}
        >
          <NavigationContainer>
            <RootStack.Navigator
              initialRouteName="Onboarding"
              screenOptions={{ headerShown: false }}
            >
              <RootStack.Screen name="Onboarding" component={OnboardScreen} />
              <RootStack.Screen name="SignIn" component={SignInScreen} />
              <RootStack.Screen name="SignUp" component={SignUpScreen} />
              <RootStack.Screen name="Main" component={MainTabs} />
            </RootStack.Navigator>
          </NavigationContainer>
        </ToastProvider>
        <Toast
          config={{
            custom_notification: ({ props }) => (
              <CustomNotificationToast notification={props.notification} />
            ),
          }}
        />
      </NotificationProvider>
    </Provider>
  )
}
