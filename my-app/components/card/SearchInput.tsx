import React from 'react'
import { View, TextInput, StyleSheet, Pressable } from 'react-native'
import { Search, X } from 'lucide-react-native'
import colors from '../../constants/colors'

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
}: {
  value: string
  onChange: (text: string) => void
  placeholder?: string
}) {
  return (
    <View style={styles.container}>
      <Search color={colors.textSecondary} size={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChange('')}>
          <X size={18} color={colors.textLight} />
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
})
