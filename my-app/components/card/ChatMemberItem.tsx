import { Pressable, Text, View, StyleSheet } from 'react-native'
import { ChatMember } from '../../types/management'
import colors from '../../constants/colors'
import Avatar from '../layouts/Avatar'

interface Props {
  member: ChatMember
  onPress: () => void
}

const ChatMemberItem = ({ member, onPress }: Props) => {
  const handlePress = () => {
    onPress()
  }

  const formattedTime = '10:00:00'

  const unreadCount = 5

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <Avatar size={50} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{member?.chat_room?.name}</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.message} numberOfLines={1}>
            {member?.chat_room?.last_message?.content
              ? member.chat_room.last_message.content
              : 'Chưa có tín nhắn nào'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

export default ChatMemberItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.separator,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  time: {
    fontSize: 12,
    color: colors.light.timestamp,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 14,
    color: colors.light.messagePreview,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.light.unread,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
})
