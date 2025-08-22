import { configureStore } from "@reduxjs/toolkit"
import pinsReducer from "./slices/pinsSlice"
import authReducer from "./slices/authSlice"
import boardsReducer from "./slices/boardsSlice"
import socialReducer from "./slices/socialSlice"

export const store = configureStore({
  reducer: {
    pins: pinsReducer,
    auth: authReducer,
    boards: boardsReducer,
    social: socialReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
