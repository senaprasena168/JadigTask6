import { configureStore } from '@reduxjs/toolkit';
import alarmReducer from './slices/alarmSlice';

export const store = configureStore({
  reducer: {
    alarms: alarmReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
