import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native'
import {
  Calendar,
  ClipboardMinus,
  Hash,
  MessageSquareText,
  Trash2,
} from 'lucide-react-native'
import colors from '../../constants/colors'
import { PriorityTag } from './PriorityTag'
import ProgressBar from '../layouts/ProgressBar'
import { Task } from '../../types/management'
import Avatar from '../layouts/Avatar'
import ConfirmModal from './ConfirmModal'
import BaseModel from '../models/BaseModel'

interface TaskItemProps {
  task: Task
  onDelete?: (id: number) => void
  onView?: (id: number) => void
  showComment?: (id: number) => void
  showDailyReports?: (id: number) => void
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onDelete,
  onView,
  showComment,
  showDailyReports,
}) => {
  const { id, title, priority, assign, process, due_date } = task
  const assignedUsers = [assign, process].filter(Boolean)

  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const formattedDate = due_date
    ? new Date(due_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      })
    : 'No date'

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onView && onView(id)}>
        <View style={styles.header}>
          <View>
            <View style={styles.idContainer}>
              <Hash size={16} color={colors.primary} />
              <Text style={styles.idText}>{id}</Text>
              <Pressable
                style={{ marginLeft: 10 }}
                onPress={() => showComment?.(task.id)}
              >
                <MessageSquareText color={colors.primary} />
              </Pressable>
              <Pressable
                style={{ marginLeft: 10 }}
                onPress={() => showDailyReports?.()}
              >
                <ClipboardMinus color={colors.primary} />
              </Pressable>
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          <TouchableOpacity onPress={() => setOpenDeleteModal(true)}>
            <Trash2 size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>In Progress</Text>
          {priority && <PriorityTag priority={priority} />}
        </View>

        <ProgressBar progress={80} color={colors.primary} height={4} />

        <View style={styles.footer}>
          <View style={styles.avatarsContainer}>
            {assignedUsers.map((user, index) => (
              <View
                key={index}
                style={{
                  marginLeft: index === 0 ? 0 : -5,
                  zIndex: 10 - index,
                }}
              >
                <Avatar name={''} size={20} uri={user?.avatar?.alt} />
              </View>
            ))}
          </View>

          <View style={styles.dateContainer}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.dateText}>{formattedDate}</Text>
            <Hash size={14} color={colors.textSecondary} />
            <Text style={styles.dateText}>{id}</Text>
          </View>
        </View>
        {openDeleteModal && (
          <ConfirmModal
            open={openDeleteModal}
            onCancel={() => {
              setOpenDeleteModal(false)
            }}
            onConfirm={() => {
              setOpenDeleteModal(false)
              onDelete?.(task.id)
            }}
          />
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
})
