import { createSlice } from "@reduxjs/toolkit";

const getInitialSettings = () => {
  const localStorageData = localStorage.getItem("appSettings")
    ? JSON.parse(localStorage.getItem("appSettings"))
    : null;

  if (localStorageData) return localStorageData;

  return {
    theme: "light",

    sidebar: {
      position: "left",
    },
    privacy: {
      analytics: true,
      crashReporting: true,
      dataCollection: false,
    },
  };
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: getInitialSettings(),
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("appSettings", JSON.stringify(state));
    },
    updateSidebar: (state, action) => {
      state.sidebar = { ...state.sidebar, ...action.payload };
      localStorage.setItem("appSettings", JSON.stringify(state));
    },
    updatePrivacy: (state, action) => {
      state.privacy = { ...state.privacy, ...action.payload };
      localStorage.setItem("appSettings", JSON.stringify(state));
    },
    resetTheme: (state) => {
      state.theme = "light";
      localStorage.setItem("appSettings", JSON.stringify(state));
    },
  },
});

export const { setTheme, updateSidebar, updatePrivacy, resetTheme } = settingsSlice.actions;

export default settingsSlice.reducer;
