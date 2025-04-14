import React from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import colors from '../../constants/colors'
import layout from '../../constants/layout'
import typography from '../../constants/typography'

interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (tabKey: string) => void
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab

        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [styles.tab, pressed && styles.tabPressed]}
            onPress={() => onTabChange(tab.key)}
          >
            <View style={styles.tabContent}>
              {tab.icon && (
                <View style={styles.iconContainer}>
                  {React.cloneElement(tab.icon as React.ReactElement, {
                    color: isActive ? colors.primary : colors.textSecondary,
                    size: 20,
                  })}
                </View>
              )}
              <Text
                style={[styles.tabLabel, isActive && styles.activeTabLabel]}
              >
                {tab.label}
              </Text>
            </View>
            {isActive && <View style={styles.activeIndicator} />}
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius.lg,
    marginHorizontal: layout.spacing.md,
    marginBottom: layout.spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: layout.spacing.md,
    position: 'relative',
  },
  tabPressed: {
    opacity: 0.8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: typography.fontSizes.xs,
    // fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.primary,
    // fontWeight: typography.fontWeights.semibold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: layout.borderRadius.full,
  },
})
