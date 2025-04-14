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
  };
  
  // Task status colors
  export const statusColors = {
    completed: colors.success,
    inProgress: colors.primary,
    pending: colors.warning,
    cancelled: colors.danger,
    review: colors.info,
  };
  
  export default colors;