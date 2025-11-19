export type TaskStatus = 'todo' | 'done';

export type TaskType = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  isSelected: boolean;
};

export type TaskFormData = {
  title: string;
  description: string;
};
