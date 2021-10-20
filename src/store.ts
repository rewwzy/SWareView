import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./redux/layout/slice";

const store = configureStore({
  reducer: {
    layoutReducer,
  },
});

export default store;