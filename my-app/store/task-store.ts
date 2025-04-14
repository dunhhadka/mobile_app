import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus } from '../types/task';
import { tasks as initialTasks } from '../mocks/tasks';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  activeFilters: {
    status: TaskStatus | 'all';
    priority: string | 'all';
    assignee: string | 'all';
    search: string;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  setTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  setFilter: (filterType: string, value: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      filteredTasks: initialTasks,
      activeFilters: {
        status: 'all',
        priority: 'all',
        assignee: 'all',
        search: '',
      },
      isLoading: false,
      error: null,

      fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just use the mock data
          set({ tasks: initialTasks, filteredTasks: initialTasks, isLoading: false });
        } catch (error) {
          set({ error: 'Failed to fetch tasks', isLoading: false });
        }
      },

      addTask: async (task: Task) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = [...get().tasks, task];
          set({ tasks, isLoading: false });
          get().setFilter('status', get().activeFilters.status);
        } catch (error) {
          set({ error: 'Failed to add task', isLoading: false });
        }
      },

      updateTask: async (taskId: string, updates: Partial<Task>) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = get().tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          );
          set({ tasks, isLoading: false });
          get().setFilter('status', get().activeFilters.status);
        } catch (error) {
          set({ error: 'Failed to update task', isLoading: false });
        }
      },

      deleteTask: async (taskId: string) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = get().tasks.filter(task => task.id !== taskId);
          set({ tasks, isLoading: false });
          get().setFilter('status', get().activeFilters.status);
        } catch (error) {
          set({ error: 'Failed to delete task', isLoading: false });
        }
      },

      setTaskStatus: async (taskId: string, status: TaskStatus) => {
        get().updateTask(taskId, { status });
      },

      setFilter: (filterType: string, value: string) => {
        const newFilters = {
          ...get().activeFilters,
          [filterType]: value,
        };
        
        set({ activeFilters: newFilters });
        
        // Apply filters
        let filtered = [...get().tasks];
        
        if (newFilters.status !== 'all') {
          filtered = filtered.filter(task => task.status === newFilters.status);
        }
        
        if (newFilters.priority !== 'all') {
          filtered = filtered.filter(task => task.priority === newFilters.priority);
        }
        
        if (newFilters.assignee !== 'all') {
          filtered = filtered.filter(task => 
            task.assignedTo.some(user => user.id === newFilters.assignee)
          );
        }
        
        if (newFilters.search) {
          const searchLower = newFilters.search.toLowerCase();
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchLower) || 
            task.description.toLowerCase().includes(searchLower)
          );
        }
        
        set({ filteredTasks: filtered });
      },

      setSearchQuery: (query: string) => {
        get().setFilter('search', query);
      },

      clearFilters: () => {
        set({ 
          activeFilters: {
            status: 'all',
            priority: 'all',
            assignee: 'all',
            search: '',
          },
          filteredTasks: get().tasks
        });
      },
    }),
    {
      name: 'task-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        tasks: state.tasks,
        activeFilters: state.activeFilters
      }),
    }
  )
);