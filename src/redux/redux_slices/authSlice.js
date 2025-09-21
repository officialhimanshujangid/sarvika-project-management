
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import userslist from '../../utils/users.json'

const getInitialState = () => {
const localStorageData = localStorage.getItem('authData') ? JSON.parse(localStorage.getItem('authData')) : null
if(localStorageData) return localStorageData
  return {
    users: userslist?.users,
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };
};



const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
   
    login: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { username, password } = action.payload;
      // Find user by username
      const user = state.users.find(user => user.username === username);
      
      if (user && user.password === password) {
        state.currentUser = { ...user };
        state.isAuthenticated = true;
        state.error = null;
        toast.success(`${user?.name} logged in succesfully`)
      } else {
        state.error = 'Invalid username or password';
        toast.error('Invalid username or password')
      }
      
      state.loading = false;
      
      // Save to localStorage
      localStorage.setItem('authData', JSON.stringify(state));
    },
    createUser: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { username, password, email, name, userType, teamId } = action.payload;
      
      // Check if username already exists
      const userExists = state.users.some(user => user.username === username);
      
      if (userExists) {
        state.error = 'Username already exists';
        toast.error('Username already exists');
      } else {
        // Check if email already exists
        const emailExists = state.users.some(user => user.email === email);
        
        if (emailExists) {
          state.error = 'Email already exists';
          toast.error('Email already exists');
        } else {
          // Create new user/employee
          // Generate sequential ID starting from highest existing ID
          const maxId = state.users.length > 0 ? Math.max(...state.users.map(user => user.id)) : 0;
          const newUser = {
            id: maxId + 1, // Use sequential ID
            username,
            password,
            name: name || username,
            email,
            userType: userType || 'employee',
            teamId: teamId || null,
            createdAt: new Date().toISOString()
          };
          
          // Add to users array
          state.users.push(newUser);
          toast.success('Employee created successfully');
        }
      }
      
      state.loading = false;
      
      // Save to localStorage
      localStorage.setItem('authData', JSON.stringify(state));
    },
    updateUser: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { id, username, password, name, email, userType, teamId } = action.payload;
      
      const userIndex = state.users.findIndex(user => user.id === id);
      
      if (userIndex !== -1) {
        // Check if another user has the same username (excluding current user)
        const usernameExists = state.users.some(user => 
          user.id !== id && user.username === username
        );
        
        if (usernameExists) {
          state.error = 'Username already exists';
          toast.error('Username already exists');
        } else {
          // Check if another user has the same email (excluding current user)
          const emailExists = state.users.some(user => 
            user.id !== id && user.email === email
          );
          
          if (emailExists) {
            state.error = 'Email already exists';
            toast.error('Email already exists');
          } else {
            state.users[userIndex] = {
              ...state.users[userIndex],
              username,
              password: password || state.users[userIndex].password, // Keep existing password if not provided
              name,
              email,
              userType,
              teamId,
              updatedAt: new Date().toISOString()
            };
            toast.success('Employee updated successfully');
          }
        }
      } else {
        state.error = 'Employee not found';
        toast.error('Employee not found');
      }
      
      state.loading = false;
      localStorage.setItem('authData', JSON.stringify(state));
    },
    
    deleteUser: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const userId = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        state.users.splice(userIndex, 1);
        toast.success('Employee deleted successfully');
      } else {
        state.error = 'Employee not found';
        toast.error('Employee not found');
      }
      
      state.loading = false;
      localStorage.setItem('authData', JSON.stringify(state));
    },
    
    assignUserToTeam: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const { userId, teamId } = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        state.users[userIndex].teamId = teamId;
        state.users[userIndex].updatedAt = new Date().toISOString();
        toast.success('Employee assigned to team successfully');
      } else {
        state.error = 'Employee not found';
        toast.error('Employee not found');
      }
      
      state.loading = false;
      localStorage.setItem('authData', JSON.stringify(state));
    },
    
    removeUserFromTeam: (state, action) => {
      state.loading = true;
      state.error = null;
      
      const userId = action.payload;
      const userIndex = state.users.findIndex(user => user.id === userId);
      
      if (userIndex !== -1) {
        state.users[userIndex].teamId = null;
        state.users[userIndex].updatedAt = new Date().toISOString();
        toast.success('Employee removed from team successfully');
      } else {
        state.error = 'Employee not found';
        toast.error('Employee not found');
      }
      
      state.loading = false;
      localStorage.setItem('authData', JSON.stringify(state));
    },
    
    clearError: (state) => {
      state.error = null;
     
    },
    
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('authData', JSON.stringify(state));
      window.location.reload();
    },

    forgotPassword: (state, action) => {
      state.loading = true;
      state.error = null;

      const { email, newPassword } = action.payload;
      
      // Find user by email
      const userIndex = state.users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        state.error = 'No account found with this email address';
        toast.error('No account found with this email address');
        state.loading = false;
        return; // Don't update password if email doesn't exist
      }
      
      // Only update password if email exists
      state.users[userIndex].password = newPassword;
      toast.success('Password updated successfully');
      state.loading = false;

      // Save to localStorage only if successful
      localStorage.setItem('authData', JSON.stringify(state));
    },

    resetPassword: (state, action) => {
      state.loading = true;
      state.error = null;

      const { email, newPassword } = action.payload;
      
      // Find user by email
      const userIndex = state.users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        state.error = 'Invalid reset token or email';
        toast.error('Invalid reset token or email');
      } else {
        // Update password
        state.users[userIndex].password = newPassword;
        toast.success('Password reset successfully');
      }
      
      state.loading = false;

      // Save to localStorage
      localStorage.setItem('authData', JSON.stringify(state));
    },
  }
});

export const { 
  login, 
  createUser, 
  updateUser, 
  deleteUser, 
  assignUserToTeam, 
  removeUserFromTeam, 
  clearError, 
  logout,
  forgotPassword,
  resetPassword
} = authSlice.actions;

export default authSlice.reducer;