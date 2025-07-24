import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimerState {
  time: number; // time in centiseconds
  isActive: boolean;
  isBeeping: boolean;
}

const initialState: TimerState = {
  time: 120000, // 20 minutes in centiseconds
  isActive: false,
  isBeeping: false,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isActive = true;
      state.isBeeping = false;
    },
    stopTimer: (state) => {
      state.isActive = false;
    },
    decrementTime: (state) => {
      if (state.time > 0) {
        state.time -= 1;
      } else {
        state.isActive = false;
        state.isBeeping = true;
      }
    },
    resetTimer: (state) => {
      state.time = 120000;
      state.isActive = false;
      state.isBeeping = false;
    },
    setTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload;
    },
    startBeeping: (state) => {
      state.isBeeping = true;
    },
    stopBeeping: (state) => {
      state.isBeeping = false;
    },
  },
});

export const { startTimer, stopTimer, decrementTime, resetTimer, setTime, startBeeping, stopBeeping } = timerSlice.actions;
export default timerSlice.reducer;