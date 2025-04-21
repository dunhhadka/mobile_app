import { LinearGradient } from 'expo-linear-gradient'
import { Play } from 'lucide-react-native'
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native'
import colors from '../../constants/colors'

interface Props {
  onClick: () => void
  action: string
  isLoading?: boolean
  showIcon?: boolean
}

export function TaskActionButton({
  onClick,
  action,
  isLoading,
  showIcon = true,
}: Props) {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={onClick}>
      <LinearGradient
        colors={['#7B5AFF', '#4D66F4']}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ marginRight: 8 }}>
              {showIcon && <Play color={colors.white} size={20} />}
            </View>
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {action}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 10,
  },
})
