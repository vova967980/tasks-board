
export interface Column {
  id: number;
  taskIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus; // если нужно
}

export type QuickFilter = 'all' | 'completed' | 'incomplete';
export type TaskStatus = 'todo' | 'done';

export interface TaskBoardState {
  columns: {
    order: number[];
    entities: Record<number, Column>;
    maxId: number;
  };
  tasks: {
    entities: Record<string, Task>;
    maxId: number;
  };
  preferences: {
    selectedTaskIds: Set<string>;
    searchQuery: string;
    filter: QuickFilter;
    editingTaskIds: Set<string>;
  };
}
