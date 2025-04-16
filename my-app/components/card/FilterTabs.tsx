import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Circle } from 'lucide-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors, { gradients } from '../../constants/colors'

export const FilterTabs = () => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'in_progress' | 'done'
  >('all')

  const handleFilterChange = (filter: 'all' | 'in_progress' | 'done') => {
    setActiveFilter(filter)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeFilter === 'all' && styles.activeTab]}
        onPress={() => handleFilterChange('all')}
      >
        <Text
          style={[
            styles.tabText,
            activeFilter === 'all' && styles.activeTabText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleFilterChange('in_progress')}>
        {activeFilter === 'in_progress' ? (
          <LinearGradient
            colors={gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.activeGradientTab}
          >
            <View style={styles.tabContent}>
              <Text style={styles.activeTabText}>In Progress</Text>
              <Circle
                size={8}
                fill={colors.inProgress}
                color={colors.inProgress}
                style={styles.tabIcon}
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={styles.tab}>
            <Text style={styles.tabText}>In Progress</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeFilter === 'done' && styles.activeTab]}
        onPress={() => handleFilterChange('done')}
      >
        <Text
          style={[
            styles.tabText,
            activeFilter === 'done' && styles.activeTabText,
          ]}
        >
          Finish
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 24,
    padding: 4,
    marginBottom: 20,

    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,

    // Shadow cho Android
    elevation: 2,

    backgroundColor: '#fff', // Cần thiết để shadow hiển thị
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  activeGradientTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  activeTabText: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '500',
  },
  tabIcon: {
    marginLeft: 4,
  },
})

export default FilterTabs
