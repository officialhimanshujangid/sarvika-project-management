import { createSlice } from '@reduxjs/toolkit';
import teamsData from '../../utils/teams.json';

const getInitialState = () => {
  const localStorageData = localStorage.getItem('teamsData') 
    ? JSON.parse(localStorage.getItem('teamsData')) 
    : null;
  
  if (localStorageData) return localStorageData;
  
  return {
    teams: teamsData?.teams || [],
    loading: false,
    error: null
  };
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState: getInitialState(),
  reducers: {
    // Create a new team
    createTeam: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { name, description } = action.payload;
      
      // Check if team name already exists
      const teamExists = state.teams.some(team => 
        team.name.toLowerCase() === name.toLowerCase()
      );
      
      if (teamExists) {
        state.error = 'Team name already exists';
      } else {
        const newTeam = {
          id: Math.max(...state.teams.map(t => t.id), 0) + 1,
          name,
          description
        };
        
        state.teams.push(newTeam);
      }
      
      state.loading = false;
      localStorage.setItem('teamsData', JSON.stringify(state));
    },
    
    // Update an existing team
    updateTeam: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { id, name, description } = action.payload;
      
      const teamIndex = state.teams.findIndex(team => team.id === id);
      
      if (teamIndex !== -1) {
        // Check if another team has the same name (excluding current team)
        const teamExists = state.teams.some(team => 
          team.id !== id && team.name.toLowerCase() === name.toLowerCase()
        );
        
        if (teamExists) {
          state.error = 'Team name already exists';
        } else {
          state.teams[teamIndex] = { id, name, description };
        }
      } else {
        state.error = 'Team not found';
      }
      
      state.loading = false;
      localStorage.setItem('teamsData', JSON.stringify(state));
    },
    
    // Delete a team
    deleteTeam: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const teamId = action.payload;
      const teamIndex = state.teams.findIndex(team => team.id === teamId);
      
      if (teamIndex !== -1) {
        state.teams.splice(teamIndex, 1);
      } else {
        state.error = 'Team not found';
      }
      
      state.loading = false;
      localStorage.setItem('teamsData', JSON.stringify(state));
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { createTeam, updateTeam, deleteTeam, clearError } = teamsSlice.actions;

export default teamsSlice.reducer;
