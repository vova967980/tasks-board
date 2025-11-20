import { configureStore } from '@reduxjs/toolkit';
import { taskBoardReducer } from './taskBoard';
import { enableMapSet } from 'immer';

enableMapSet();

export const store = configureStore({
  reducer: {
    taskBoard: taskBoardReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'taskBoard.preferences.selectedTaskIds',
          'taskBoard.preferences.editingTaskIds',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
