// Color palette for the app
export const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  secondary: '#00CECE',
  accent: '#FF9F43',
  success: '#28C76F',
  danger: '#EA5455',
  warning: '#FF9F43',
  info: '#00CECE',
  dark: '#1E1E2D',
  grey: '#EDEDED',
  greyDark: '#BABABA',
  greyLight: '#F8F8F8',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  background: '#F8F8F8',
  cardBackground: '#FFFFFF',
  textPrimary: '#1E1E2D',
  textSecondary: '#6E6B7B',
  textLight: '#BABABA',
  border: '#EDEDED',
  shadow: 'rgba(0, 0, 0, 0.05)',
  inProgress: '#FF9500',
  text: '#333333',
  light: {
    text: '#333333',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
    primaryPurple: '#8A6FE8',
    secondaryPurple: '#7F5AF8',
    lightPurple: '#A48BFF',
    backgroundLight: '#F5F8FA',
    textLight: '#666666',
    borderColor: '#E5E9EC',
  },

  todo: '#6366F1', // Blue for To Do
  done: '#10B981', // Green for Done

  highPriority: '#EF4444', // Red
  mediumPriority: '#F59E0B', // Orange
  lowPriority: '#10B981', // Green

  primaryDark: '#6A5ACD',

  statusBarIcons: '#FFFFFF',

  divider: '#CBD5E1',
}

// Task status colors
export const statusColors = {
  completed: colors.success,
  inProgress: colors.inProgress,
  pending: colors.warning,
  cancelled: colors.danger,
  review: colors.info,
  todo: colors.todo,
  done: colors.done,
}

export const gradients = {
  primary: ['#ff7e5f', '#feb47b'] as [string, string],
  card: ['rgba(239, 245, 245, 0.9)', 'rgba(239, 245, 245, 0.7)'],
}

export default colors
