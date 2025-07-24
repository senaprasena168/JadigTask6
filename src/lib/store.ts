import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './features/timer/timerSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      timer: timerReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];