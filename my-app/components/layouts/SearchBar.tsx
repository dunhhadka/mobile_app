import { SearchIcon } from 'lucide-react-native'
import { TextInput, View } from 'react-native'

interface SearchBarProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus,
}: SearchBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 8,
      }}
    >
      <View style={{ marginRight: 8 }}>
        <SearchIcon size={24} color="#000" />
      </View>
      <TextInput
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          flex: 1,
          fontSize: 16,
          color: '#000',
        }}
      />
    </View>
  )
}
