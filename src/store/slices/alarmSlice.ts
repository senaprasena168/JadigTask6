import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Alarm {
  id: string;
  time: number;
  label: string;
  isActive: boolean;
  isTriggered: boolean;
  repeatType?: 'daily' | 'weekdays' | 'weekend' | 'monthly' | 'biannual' | 'annual';
  nextTrigger?: Date;
}

interface AlarmsState {
  alarms: Alarm[];
  activeAlarm?: Alarm;
  isSyncing: boolean;
}

const initialState: AlarmsState = {
  alarms: [],
  activeAlarm: undefined,
  isSyncing: false,
};

const alarmSlice = createSlice({
  name: 'alarms',
  initialState,
  reducers: {
    addAlarm: (state, action: PayloadAction<Partial<Alarm>>) => {
      const newAlarm: Alarm = {
        id: crypto.randomUUID(),
        time: action.payload.time || 0,
        label: action.payload.label || 'New Alarm',
        isActive: true,
        isTriggered: false,
        ...action.payload,
      };
      state.alarms.push(newAlarm);
    },
    updateAlarm: (state, action: PayloadAction<Partial<Alarm>>) => {
      const alarm = state.alarms.find(a => a.id === action.payload.id);
      if (alarm) {
        Object.assign(alarm, action.payload);
      }
    },
    triggerAlarm: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(a => a.id === action.payload);
      if (alarm) {
        alarm.isTriggered = true;
        state.activeAlarm = alarm;
      }
    },
    snoozeAlarm: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(a => a.id === action.payload);
      if (alarm) {
        alarm.isTriggered = false;
        alarm.isActive = true;
        state.activeAlarm = undefined;
      }
    },
    markAlarmDone: (state, action: PayloadAction<string>) => {
      const alarm = state.alarms.find(a => a.id === action.payload);
      if (alarm) {
        alarm.isActive = false;
        alarm.isTriggered = false;
        state.activeAlarm = undefined;
      }
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
  },
});

export const {
  addAlarm,
  updateAlarm,
  triggerAlarm,
  snoozeAlarm,
  markAlarmDone,
  setSyncing,
} = alarmSlice.actions;

export default alarmSlice.reducer;
