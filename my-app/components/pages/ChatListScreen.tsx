import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useGetChatMemberByUserIdQuery } from '../../api/magementApi'
import colors from '../../constants/colors'
import { ChevronLeft } from 'lucide-react-native'
import ChatMemberItem from '../card/ChatMemberItem'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../../App'
import Loading from '../loading/Loading'

const ChatListScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>()

  const currentUser = useSelector((state: RootState) => state.user.currentUser)
  const { data: chatMembers, isLoading: isChatLoading } =
    useGetChatMemberByUserIdQuery(currentUser?.id ?? 0, {
      refetchOnMountOrArgChange: true,
    })

  const isLoading = isChatLoading
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={colors.light.tint} />
        </Pressable>
        <Text>Danh sách nhóm chat</Text>
      </View>
      <FlatList
        data={chatMembers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ChatMemberItem
            member={item}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                room_id: item.chat_room.id,
                member_id: item.id,
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      {isLoading && <Loading />}
    </SafeAreaView>
  )
}

export default ChatListScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundSecondary,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    backgroundColor: colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    height: '100%',
  },
})
