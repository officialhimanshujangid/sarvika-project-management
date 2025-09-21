import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import tasksData from '../../utils/tasks.json';

const getInitialState = () => {
  const localStorageData = localStorage.getItem('tasksData') ? JSON.parse(localStorage.getItem('tasksData')) : null;
  if (localStorageData) return localStorageData;
  return {
    tasks: tasksData?.tasks || [],
    loading: false,
    error: null
  };
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: getInitialState(),
  reducers: {
    createTask: (state, action) => {
      state.loading = true;
      state.error = null;

      const { title, description, projectId, assignedTo, priority, dueDate, currentUser } = action.payload;

      // Check if user has permission to create tasks (only head users)
      if (currentUser?.userType !== 'head') {
        state.error = 'Only administrators can create tasks';
        toast.error('Only administrators can create tasks');
        state.loading = false;
        return;
      }

      // Create new task
      // Generate sequential ID starting from highest existing ID
      const maxId = state.tasks.length > 0 ? Math.max(...state.tasks.map(task => task.id)) : 0;
      const newTask = {
        id: maxId + 1,
        title,
        description,
        projectId: parseInt(projectId),
        assignedTo: parseInt(assignedTo),
        status: 'todo',
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      state.tasks.push(newTask);
      toast.success('Task created successfully');
      state.loading = false;

      // Save to localStorage
      localStorage.setItem('tasksData', JSON.stringify(state));
    },

    updateTask: (state, action) => {
      state.loading = true;
      state.error = null;

      const { id, title, description, projectId, assignedTo, status, priority, dueDate } = action.payload;

      const taskIndex = state.tasks.findIndex(task => task.id === id);

      if (taskIndex === -1) {
        state.error = 'Task not found';
        toast.error('Task not found');
      } else {
        // Update task while preserving projectId
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          title,
          description,
          projectId: projectId || state.tasks[taskIndex].projectId, // Preserve existing projectId if not provided
          assignedTo: parseInt(assignedTo),
          status: status || state.tasks[taskIndex].status, // Preserve existing status if not provided
          priority,
          dueDate,
          updatedAt: new Date().toISOString()
        };

        toast.success('Task updated successfully');
      }

      state.loading = false;

      // Save to localStorage
      localStorage.setItem('tasksData', JSON.stringify(state));
    },

    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);

      if (taskIndex !== -1) {
        state.tasks[taskIndex].status = status;
        state.tasks[taskIndex].updatedAt = new Date().toISOString();

        // Save to localStorage
        localStorage.setItem('tasksData', JSON.stringify(state));
      }
    },

    deleteTask: (state, action) => {
      state.loading = true;
      state.error = null;

      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);

      if (taskIndex === -1) {
        state.error = 'Task not found';
        toast.error('Task not found');
      } else {
        state.tasks.splice(taskIndex, 1);
        toast.success('Task deleted successfully');
      }

      state.loading = false;

      // Save to localStorage
      localStorage.setItem('tasksData', JSON.stringify(state));
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  createTask, 
  updateTask, 
  updateTaskStatus, 
  deleteTask, 
  clearError 
} = tasksSlice.actions;

export default tasksSlice.reducer;
