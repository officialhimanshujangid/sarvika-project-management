import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./redux_slices/authSlice";
import settingsReducer from "./redux_slices/settingsSlice";
import teamsReducer from "./redux_slices/teamsSlice";
import projectsReducer from "./redux_slices/projectsSlice";
import tasksReducer from "./redux_slices/tasksSlice";

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
    settings: settingsReducer,
    teams: teamsReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  }),
});
