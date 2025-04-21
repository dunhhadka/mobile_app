import { useState } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
  StyleSheet, // ✅ Đã thêm StyleSheet
} from 'react-native'
import colors from '../../constants/colors'

export interface Item {
  value: number
  label: string
}

interface SelectOption {
  title: string
  subtitle?: string
  data: Item[]
  selectedId?: number
  onSelect?: (id: number | number[]) => void
  onCancel?: () => void
  multiple?: boolean
  multipleSelected?: number[]
  onMultipleSelected?: (ids: number[]) => void
}

export default function SelectOption({
  title,
  subtitle,
  data,
  selectedId,
  onSelect,
  onCancel,
  multiple,
  multipleSelected,
  onMultipleSelected,
}: SelectOption) {
  const [current, setCurrent] = useState<number | undefined>(selectedId)
  const [multipleSelectedIds, setMultipleSelectedIds] = useState<number[]>(
    multipleSelected ?? []
  )

  const handleSelect = () => {
    if (current !== undefined) {
      onSelect?.(current)
    }
  }

  console.log(data)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <FlatList
        data={data}
        keyExtractor={(item) => String(item.value)} // ✅ Ép thành string
        style={{ marginTop: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              current === item.value && styles.itemSelected,
              multiple &&
                multipleSelectedIds.includes(item.value) &&
                styles.itemSelected,
            ]}
            onPress={() => {
              if (!multiple) {
                setCurrent(item.value)
                return
              }
              setMultipleSelectedIds((prev) => {
                if (prev.includes(item.value))
                  return prev.filter((id) => id !== item.value)
                return [...prev, item.value]
              })
            }}
          >
            <View style={styles.itemText}>
              <Text style={styles.label}>{item.label}</Text>
            </View>
            <View style={styles.radioCircle}>
              {current === item.value && <View style={styles.radioDot} />}
              {multiple && multipleSelectedIds.includes(item.value) && (
                <View style={styles.radioDot} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectButton,
            current === undefined && !multiple && { opacity: 0.5 },
          ]}
          disabled={current === undefined && !multiple}
          onPress={() => {
            if (!multiple) handleSelect()
            else onMultipleSelected?.(multipleSelectedIds)
          }}
        >
          <Text style={styles.selectText}>Chọn</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
    width: '100%',
    marginBottom: 40,
    height: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    textAlign: 'left',
  },
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemSelected: {
    borderColor: '#9C6EF3',
    backgroundColor: '#F4F0FC',
  },
  itemText: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
  },
  desc: {
    fontSize: 13,
    color: '#666',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  cancelButton: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.primary,
    fontWeight: '600',
  },
  selectButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectText: {
    color: '#fff',
    fontWeight: '600',
  },
})
