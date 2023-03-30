import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalProps {
  isInitialized: boolean;
  activeTab: number;
}

const initialState: GlobalProps = {
  isInitialized: false,
  activeTab: 0,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setAttributes: (state, action) => {
      return { ...state, ...action.payload };
    },
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setAttributes, setActiveTab } = globalSlice.actions;

export default globalSlice.reducer;

export const initialize = () => {
  return setAttributes({ isInitialized: true });
};
