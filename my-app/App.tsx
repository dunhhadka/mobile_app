import React, { ElementType } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Bell, Calendar, Home, ListChecks, User } from 'lucide-react-native'
import { Provider } from 'react-redux' // Đừng quên import Provider từ react-redux
import { store } from './store/store' // Import store đã tạo

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

// Create Stack and Tab navigators
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

interface ToastRenderProps {
  type?: string
  message?: string | React.ReactNode
  [key: string]: any
}

// Main tabs navigator
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tasks" component={TaskScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Notification" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

// App component with stack navigation
export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider
        renderToast={({ type, message }: ToastRenderProps) => (
          <CustomToast
            type={(type as 'success' | 'error' | 'info') || 'info'}
            message={typeof message === 'string' ? message : ''} // Chỉ lấy string
          />
        )}
        placement="top"
        offsetTop={50}
        animationType="slide-in"
        swipeEnabled={true}
      >
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={OnboardScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ToastProvider>
    </Provider>
  )
}
