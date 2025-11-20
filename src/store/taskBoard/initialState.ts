import type { TaskBoardState } from './types.ts';

export const initialState: TaskBoardState = {
  columns: {
    order: [],
    entities: {},
    maxId: 1,
  },
  tasks: {
    entities: {},
    maxId: 1,
  },
  preferences: {
    selectedTaskIds: new Set(),
    editingTaskIds: new Set(),
    searchQuery: '',
    filter: 'all',
  },
};
