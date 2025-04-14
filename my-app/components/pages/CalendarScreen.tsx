import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ChevronLeft, ChevronRight } from 'lucide-react-native'
import { useTaskStore } from '../../store/task-store'
import colors from '../../constants/colors'
import TaskCard from '../layouts/TaskCard'
import layout from '../../constants/layout'
import typography from '../../constants/typography'

// Helper functions for calendar
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate()
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

const getMonthName = (month: number) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return months[month]
}

export default function CalendarScreen() {
  const router = useRouter()
  const { tasks } = useTaskStore()

  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today.getDate())

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(1)
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(1)
  }

  // Filter tasks for the selected date
  const selectedDateObj = new Date(currentYear, currentMonth, selectedDate)
  const selectedDateString = selectedDateObj.toISOString().split('T')[0]

  const tasksForSelectedDate = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
    return taskDate === selectedDateString
  })

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Create rows for the calendar
  const calendarRows: any[] = []
  let calendarRow: any[] = []

  calendarDays.forEach((day, index) => {
    calendarRow.push(day)

    if ((index + 1) % 7 === 0 || index === calendarDays.length - 1) {
      // Fill the rest of the last row with null
      while (calendarRow.length < 7) {
        calendarRow.push(null)
      }

      calendarRows.push([...calendarRow])
      calendarRow = []
    }
  })

  // Check if a day has tasks
  const dayHasTasks = (day: number) => {
    if (!day) return false

    const dateObj = new Date(currentYear, currentMonth, day)
    const dateString = dateObj.toISOString().split('T')[0]

    return tasks.some((task) => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0]
      return taskDate === dateString
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <Pressable style={styles.monthButton} onPress={goToPreviousMonth}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.monthTitle}>
            {getMonthName(currentMonth)} {currentYear}
          </Text>

          <Pressable style={styles.monthButton} onPress={goToNextMonth}>
            <ChevronRight size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.weekdaysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
            (day, index) => (
              <Text key={index} style={styles.weekdayText}>
                {day}
              </Text>
            )
          )}
        </View>

        <View style={styles.daysContainer}>
          {calendarRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.weekRow}>
              {row.map((day: any, dayIndex: any) => (
                <Pressable
                  key={dayIndex}
                  style={[
                    styles.dayCell,
                    day === selectedDate && styles.selectedDayCell,
                    !day && styles.emptyDayCell,
                  ]}
                  onPress={() => day && setSelectedDate(day)}
                  disabled={!day}
                >
                  {day && (
                    <>
                      <Text
                        style={[
                          styles.dayText,
                          day === selectedDate && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                      {dayHasTasks(day) && (
                        <View
                          style={[
                            styles.taskIndicator,
                            day === selectedDate &&
                              styles.selectedTaskIndicator,
                          ]}
                        />
                      )}
                    </>
                  )}
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.tasksTitle}>
          Tasks for {getMonthName(currentMonth)} {selectedDate}, {currentYear}
        </Text>

        <ScrollView
          style={styles.tasksList}
          contentContainerStyle={styles.tasksListContent}
          showsVerticalScrollIndicator={false}
        >
          {tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map((task) => (
              <View key={task.id} style={styles.taskCardContainer}>
                <TaskCard
                  task={task}
                  onPress={() => router.push(`/task/${task.id}`)}
                />
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                No tasks scheduled for this day
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: layout.spacing.lg,
    paddingTop: layout.spacing.lg,
    paddingBottom: layout.spacing.md,
  },
  title: {
    fontSize: typography.fontSizes['3xl'],
    // fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    margin: layout.spacing.lg,
    padding: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.spacing.md,
  },
  monthButton: {
    padding: layout.spacing.xs,
  },
  monthTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: layout.spacing.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSizes.sm,
    // fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
  },
  daysContainer: {
    marginBottom: layout.spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: layout.spacing.sm,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: layout.borderRadius.md,
  },
  selectedDayCell: {
    backgroundColor: colors.primary,
  },
  emptyDayCell: {
    opacity: 0,
  },
  dayText: {
    fontSize: typography.fontSizes.md,
    // fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
  },
  selectedDayText: {
    color: colors.white,
  },
  taskIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  selectedTaskIndicator: {
    backgroundColor: colors.white,
  },
  tasksContainer: {
    flex: 1,
    paddingHorizontal: layout.spacing.lg,
  },
  tasksTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: layout.spacing.md,
  },
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    paddingBottom: layout.spacing.xl,
  },
  taskCardContainer: {
    marginBottom: layout.spacing.md,
  },
  emptyStateContainer: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    padding: layout.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
  },
})
