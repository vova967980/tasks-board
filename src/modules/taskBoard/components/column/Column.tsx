import styles from './column.module.scss';
import { Button, CheckboxWithLabel } from '@ui-kit';
import { isIndeterminate } from '@shared-utils';
import { AddIcon, DeleteIcon, DragIndicatorIcon } from '@assets';
import { TaskCard } from '../taskCard';
import type { FC } from 'react';
import type { TaskFormData, TaskType } from '../../types';

interface ColumnProps {
  tasksDict: Record<string, TaskType>;
  onRemoveTask: (taskId: string) => void;
  onEditTask: (taskId: string, data: TaskFormData) => void;
  toggleSelect: (taskId: string) => void;
  toggleMarkDone: (taskId: string) => void;
}

export const Column: FC<ColumnProps> = ({
  tasksDict,
  onRemoveTask,
  onEditTask,
  toggleSelect,
  toggleMarkDone,
}) => {
  const tasksList = Object.values(tasksDict);
  const indeterminateSelectAll = isIndeterminate(tasksList, t => t.isSelected);

  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnHeader}>
        <CheckboxWithLabel
          className={styles.labeledCheckbox}
          onChange={() => console.log('Select All')}
          checked={false}
          disabled={!tasksList.length}
          indeterminate={indeterminateSelectAll}
        >
          Select All
        </CheckboxWithLabel>
        <div className={styles.columnActionsWrapper}>
          <Button size="sm" variant="icon" className={styles.moveColumnButton}>
            <DragIndicatorIcon />
          </Button>
          <Button size="sm" variant="iconDanger">
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <div className={styles.columnBody}>
        <Button>
          <AddIcon /> Add Task
        </Button>
        {tasksList.map(task => (
          <TaskCard
            key={task.id}
            {...task}
            onRemove={() => onRemoveTask(task.id)}
            toggleSelect={() => toggleSelect(task.id)}
            toggleMarkDone={() => toggleMarkDone(task.id)}
            onEdit={data => onEditTask(task.id, data)}
          />
        ))}
      </div>
    </div>
  );
};
