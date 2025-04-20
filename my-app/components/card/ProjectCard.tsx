import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import {
  Circle,
  Edit,
  FileText,
  Calendar,
  CheckSquare,
} from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../../constants/colors'
import { Project } from '../../types/management'
import { formatDate, formatDateTime } from '../models/UpdateProfileModal'

export type ProjectStatus = 'in_progress' | 'done'

interface ProjectCardProps {
  project: Project
  onEdit: (id: number) => void
}

export const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const { id, title, description, status, started_on, tasks, users } = project

  const tasksCompleted =
    tasks?.filter((t) => t.status === 'finish')?.length ?? 0
  const totalTasks = tasks?.length ?? 0

  const isInProgress = status === 'in_process'
  const statusColor = isInProgress ? colors.inProgress : colors.success
  const statusText = isInProgress ? 'In Progress' : 'Done'

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}
        >
          <Circle
            size={8}
            fill={statusColor}
            color={statusColor}
            style={styles.statusIcon}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <FileText size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{description}</Text>
        </View>

        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>Ngày bắt đầu:</Text>
          <Text style={styles.detailValue}>{formatDateTime(started_on)}</Text>
        </View>

        <View style={styles.detailRow}>
          <CheckSquare size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>Tasks</Text>
          <View style={styles.taskProgress}>
            <Text style={styles.taskCount}>
              {tasksCompleted}/{totalTasks}
            </Text>
            <Text style={[styles.taskStatus, { color: colors.success }]}>
              Đã hoàn thành
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.collaborators}>
          {users?.slice(0, 3).map((user, index) => (
            <Image
              key={user.id}
              source={{ uri: user.avatar?.src }}
              style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(id)}>
          <Edit size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: 'white',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  taskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  taskCount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collaborators: {
    flexDirection: 'row',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProjectCard
