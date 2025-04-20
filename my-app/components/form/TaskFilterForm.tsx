import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Filter } from 'lucide-react-native'
import colors from '../../constants/colors'
import { TaskActionButton } from '../buttons/TaskActionButton'
import SearchInput from '../card/SearchInput'
import { TaskFilterRequest, StatusType } from '../../types/management'

export interface StatusContent {
  label: string
  value: 'all' | StatusType
  color: string
}

const statusOptions: StatusContent[] = [
  { label: 'Tất cả', value: 'all', color: colors.done },
  { label: 'Chưa bắt đầu', value: 'to_do', color: colors.todo },
  { label: 'Đang thực hiện', value: 'in_process', color: colors.inProgress },
  { label: 'Hoàn thành', value: 'finish', color: colors.done },
]

interface Props {
  filter: TaskFilterRequest
  onFilter: (filter: TaskFilterRequest) => void
}

const TaskFilterForm = ({ filter, onFilter }: Props) => {
  const [query, setQuery] = useState<string>(filter.title || '')
  const [selectedStatus, setSelectedStatus] = useState<'all' | StatusType>(
    'all'
  )

  useEffect(() => {
    if (filter.status) {
      setSelectedStatus(filter.status)
    }
  }, [filter.status])

  const toggleStatus = (value: 'all' | StatusType) => {
    setSelectedStatus(value)
  }

  const handleFilter = () => {
    onFilter({
      ...filter,
      title: query,
      status: selectedStatus === 'all' ? undefined : selectedStatus,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Filter size={20} color={colors.primary} />
        <Text style={styles.headerText}>Bộ lọc</Text>
      </View>

      <Text style={styles.label}>Tiêu đề task:</Text>
      <SearchInput
        value={query}
        onChange={(value) => setQuery(value)}
        placeholder="Nhập tiêu đề task"
      />

      <Text style={styles.label}>Trạng thái:</Text>
      <View style={styles.statusContainer}>
        {statusOptions.map((option) => {
          const isActive = selectedStatus === option.value
          return (
            <Pressable
              key={option.value}
              onPress={() => toggleStatus(option.value)}
              style={[
                styles.statusButton,
                {
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive ? colors.primary : colors.greyLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isActive && { color: colors.white, fontWeight: '600' },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>

      <TaskActionButton
        onClick={handleFilter}
        action="Tìm kiếm"
        showIcon={false}
      />
    </View>
  )
}

export default TaskFilterForm

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    gap: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
})
