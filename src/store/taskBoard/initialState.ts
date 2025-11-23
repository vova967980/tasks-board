import type { TaskBoardState } from './types.ts';

function loadState() {
  try {
    const raw = localStorage.getItem('taskBoard');
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

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
  ...loadState(),
};
