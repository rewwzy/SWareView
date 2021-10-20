import { createSlice } from "@reduxjs/toolkit";

const LayoutSlide = createSlice({
  name: "LayoutSlide",
  initialState: {
    nav_type: 'horizontal',
  },
  reducers: {
    changedNavType: (state, { payload }) => {
      localStorage.setItem("nav_type", payload);
      state.nav_type = payload;
    },
  },
});

export const { changedNavType } = LayoutSlide.actions;

export default LayoutSlide.reducer;
