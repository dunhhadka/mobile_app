import React from 'react'
import { View, StyleSheet, Text, TextStyle } from 'react-native'
import Avatar from './Avatar'
import colors from '../../constants/colors'
import typography from '../../constants/typography'
import { User } from '../../types/task'

interface AvatarGroupProps {
  users: User[]
  maxDisplayed?: number
  size?: number
}

export default function AvatarGroup({
  users,
  maxDisplayed = 3,
  size = 32,
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, maxDisplayed)
  const remainingCount = users.length - maxDisplayed

  return (
    <View style={styles.container}>
      {displayUsers.map((user, index) => (
        <View
          key={user.id}
          style={[
            styles.avatarWrapper,
            {
              zIndex: displayUsers.length - index,
              marginLeft: index === 0 ? 0 : -size * 0.3,
            },
          ]}
        >
          <Avatar
            uri={user.avatar}
            name={user.name}
            size={size}
            //   showBorder
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingCount,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -size * 0.3,
            },
          ]}
        >
          <Text style={styles.remainingCountText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  remainingCount: {
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  remainingCountText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.xs,
    fontWeight: '600', // ✅ Sửa lỗi tại đây
  },
})
