import { configureStore } from '@reduxjs/toolkit';
import { taskBoardReducer } from './taskBoard';
import { enableMapSet } from 'immer';
import { persistSlice } from '@store/utils.ts';

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

persistSlice(store, "taskBoard", (sliceState) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { preferences, ...rest } = sliceState;

  localStorage.setItem("taskBoard", JSON.stringify(rest));
});
