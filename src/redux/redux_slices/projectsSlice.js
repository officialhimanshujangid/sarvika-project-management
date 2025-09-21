import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import projectsData from '../../utils/projects.json';

const getInitialState = () => {
  const localStorageData = localStorage.getItem('projectsData') ? JSON.parse(localStorage.getItem('projectsData')) : null;
  if (localStorageData) return localStorageData;
  return {
    projects: projectsData?.projects || [],
    loading: false,
    error: null
  };
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState: getInitialState(),
  reducers: {
    createProject: (state, action) => {
      state.loading = true;
      state.error = null;

      const { name, description, teamId, priority, startDate, endDate, currentUser } = action.payload;

      // Check if user has permission to create projects (only head users)
      if (currentUser?.userType !== 'head') {
        state.error = 'Only administrators can create projects';
        toast.error('Only administrators can create projects');
        state.loading = false;
        return;
      }

      // Check if project name already exists
      const projectExists = state.projects.some(project => project.name === name);

      if (projectExists) {
        state.error = 'Project with this name already exists';
        toast.error('Project with this name already exists');
      } else {
        // Create new project
        // Generate sequential ID starting from highest existing ID
        const maxId = state.projects.length > 0 ? Math.max(...state.projects.map(project => project.id)) : 0;
        const newProject = {
          id: maxId + 1,
          name,
          description,
          teamId: parseInt(teamId),
          status: 'planning',
          priority,
          startDate,
          endDate,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        state.projects.push(newProject);
        toast.success('Project created successfully');
      }

      state.loading = false;

      // Save to localStorage
      localStorage.setItem('projectsData', JSON.stringify(state));
    },

    updateProject: (state, action) => {
      state.loading = true;
      state.error = null;

      const { id, name, description, teamId, status, priority, startDate, endDate } = action.payload;

      const projectIndex = state.projects.findIndex(project => project.id === id);

      if (projectIndex === -1) {
        state.error = 'Project not found';
        toast.error('Project not found');
      } else {
        // Check if name is being changed and if new name already exists
        if (name !== state.projects[projectIndex].name) {
          const nameExists = state.projects.some(project => project.name === name && project.id !== id);
          if (nameExists) {
            state.error = 'Project with this name already exists';
            toast.error('Project with this name already exists');
            state.loading = false;
            return;
          }
        }

        // Update project
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          name,
          description,
          teamId: parseInt(teamId),
          status,
          priority,
          startDate,
          endDate,
          updatedAt: new Date().toISOString()
        };

        toast.success('Project updated successfully');
      }

      state.loading = false;

      // Save to localStorage
      localStorage.setItem('projectsData', JSON.stringify(state));
    },

    deleteProject: (state, action) => {
      state.loading = true;
      state.error = null;

      const projectId = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === projectId);

      if (projectIndex === -1) {
        state.error = 'Project not found';
        toast.error('Project not found');
      } else {
        state.projects.splice(projectIndex, 1);
        toast.success('Project deleted successfully');
      }

      state.loading = false;

      // Save to localStorage
      localStorage.setItem('projectsData', JSON.stringify(state));
    },

    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  createProject, 
  updateProject, 
  deleteProject, 
  clearError 
} = projectsSlice.actions;

export default projectsSlice.reducer;
