import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import matchReducer from "./matchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    match: matchReducer,
  },
});
