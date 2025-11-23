import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialState.ts';
import type { QuickFilter, Task } from './types.ts';

const taskBoardSlice = createSlice({
  name: 'taskBoard',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<{ columnId: number; task: Omit<Task, 'id' | 'status'> }>) {
      const { columnId, task } = action.payload;

      const id = `TASK-${state.tasks.maxId}`;
      state.tasks.maxId += 1;

      state.tasks.entities[id] = { id, status: 'todo', ...task };
      state.columns.entities[columnId].taskIds.unshift(id);
    },

    updateTask(state, action: PayloadAction<{ taskId: string; updates: Partial<Task> }>) {
      const { taskId, updates } = action.payload;
      Object.assign(state.tasks.entities[taskId], updates);
    },

    removeTask(state, action: PayloadAction<{ taskId: string }>) {
      const { taskId } = action.payload;
      console.log('remove task', taskId);

      delete state.tasks.entities[taskId];

      for (const col of Object.values(state.columns.entities)) {
        col.taskIds = col.taskIds.filter(id => id !== taskId);
      }

      state.preferences.selectedTaskIds.delete(taskId);
      state.preferences.editingTaskIds.delete(taskId);
    },

    addColumn(state) {
      const id = state.columns.maxId;
      state.columns.maxId += 1;

      state.columns.entities[id] = { id, taskIds: [] };
      state.columns.order.push(id);
    },

    removeColumn(state, action: PayloadAction<{ columnId: number }>) {
      const { columnId } = action.payload;

      for (const taskId of state.columns.entities[columnId].taskIds) {
        delete state.tasks.entities[taskId];
        state.preferences.selectedTaskIds.delete(taskId);
        state.preferences.editingTaskIds.delete(taskId);
      }

      delete state.columns.entities[columnId];
      state.columns.order = state.columns.order.filter(id => id !== columnId);
    },

    selectTask(state, action: PayloadAction<{ taskId: string; selected: boolean }>) {
      const { taskId, selected } = action.payload;

      if (selected) {
        state.preferences.selectedTaskIds.add(taskId);
      } else {
        state.preferences.selectedTaskIds.delete(taskId);
      }
    },

    selectMany(state, action: PayloadAction<{ ids: string[]; selected: boolean }>) {
      const { ids, selected } = action.payload;

      if (selected) {
        ids.forEach(id => state.preferences.selectedTaskIds.add(id));
      } else {
        ids.forEach(id => state.preferences.selectedTaskIds.delete(id));
      }
    },

    setSearchQuery(state, action: PayloadAction<string>) {
      state.preferences.searchQuery = action.payload;
    },

    setFilter(state, action: PayloadAction<QuickFilter>) {
      state.preferences.filter = action.payload;
    },

    deleteSelectedTasks(state) {
      for (const taskId of state.preferences.selectedTaskIds) {
        delete state.tasks.entities[taskId];
        for (const col of Object.values(state.columns.entities)) {
          col.taskIds = col.taskIds.filter(id => id !== taskId);
        }
      }
      state.preferences.selectedTaskIds.clear();
    },

    markSelectedDone(state) {
      for (const id of state.preferences.selectedTaskIds) {
        state.tasks.entities[id].status = 'done';
      }

      state.preferences.selectedTaskIds.clear();
    },

    markSelectedUndone(state) {
      for (const id of state.preferences.selectedTaskIds) {
        state.tasks.entities[id].status = 'todo';
      }

      state.preferences.selectedTaskIds.clear();
    },

    moveColumn(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      const order = state.columns.order;

      const [removed] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, removed);
    },

    moveTask(
      state,
      action: PayloadAction<{
        taskId: string;
        sourceColumnId: number;
        destinationColumnId: number;
        sourceIndex: number;
        destinationIndex: number;
      }>,
    ) {
      const { taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } =
        action.payload;

      const sourceList = state.columns.entities[sourceColumnId].taskIds;
      const destList = state.columns.entities[destinationColumnId].taskIds;

      sourceList.splice(sourceIndex, 1);

      let insertIndex = destinationIndex;

      if (insertIndex < 0) insertIndex = 0;
      if (insertIndex > destList.length) insertIndex = destList.length;

      destList.splice(insertIndex, 0, taskId);
    },

    moveTaskGroup(
      state,
      action: PayloadAction<{
        taskIds: string[];
        sourceColumnId: number;
        destinationColumnId: number;
        sourceIndex: number;
        destinationIndex: number;
      }>,
    ) {
      const { taskIds, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex } =
        action.payload;

      const sourceList = state.columns.entities[sourceColumnId].taskIds;
      const destList = state.columns.entities[destinationColumnId].taskIds;

      const sorted = sourceList.filter(id => taskIds.includes(id));
      if (!sorted.length) return;

      sorted.forEach(id => {
        const idx = sourceList.indexOf(id);
        if (idx !== -1) {
          sourceList.splice(idx, 1);
        }
      });

      const isSameColumn = sourceColumnId === destinationColumnId;
      const isMovingDown = isSameColumn && sourceIndex < destinationIndex;

      const rawDestinationIndex = isMovingDown
        ? destinationIndex - (sorted.length - 1)
        : destinationIndex;

      const clampedDestinationIndex = Math.max(0, Math.min(rawDestinationIndex, destList.length));

      destList.splice(clampedDestinationIndex, 0, ...sorted);
    },
  },
});

export const {
  addTask,
  updateTask,
  removeTask,
  selectTask,
  addColumn,
  removeColumn,
  selectMany,
  setSearchQuery,
  setFilter,
  deleteSelectedTasks,
  markSelectedDone,
  markSelectedUndone,
  moveColumn,
  moveTask,
  moveTaskGroup,
} = taskBoardSlice.actions;

export default taskBoardSlice.reducer;
