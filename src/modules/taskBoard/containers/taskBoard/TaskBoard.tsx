import { AddIcon } from '@assets';
import { Column, ControlPanel } from '../../components';
import styles from './taskBoard.module.scss';
import { Button } from '@ui-kit';
import clsx from 'clsx';
import type { TaskType } from '../../types';

const columns: Record<string, TaskType>[] = [
  {
    'TASK-0': {
      id: 'TASK-0',
      status: 'todo',
      title: 'First Task',
      description: 'First Task description',
      isSelected: false,
    },
    'TASK-1': {
      id: 'TASK-1',
      status: 'done',
      title: 'Second Task',
      description: 'Second Task description',
      isSelected: false,
    },
  },
  {
    'TASK-3': {
      id: 'TASK-3',
      status: 'todo',
      title: 'Third Task',
      description: 'Third Task description',
      isSelected: false,
    },
    'TASK-4': {
      id: 'TASK-4',
      status: 'todo',
      title: 'Fourth Task',
      description:
        'Fourth Task description long text long text long text long text long text long text long text long text long text long text',
      isSelected: false,
    },
    'TASK-5': {
      id: 'TASK-5',
      status: 'todo',
      title: 'Just Task',
      description: '',
      isSelected: true,
    },
  },
  {},
];

export const TaskBoard = () => {
  return (
    <div className={styles.boardWrapper}>
      <ControlPanel />
      <div className={styles.columnsWrapper}>
        {columns.map((tasks, index) => (
          <Column
            key={`column-${index}`}
            tasksDict={tasks}
            onRemoveTask={id => console.log(`Remove ${id}`)}
            toggleSelect={id => console.log(`Toggle select ${id}`)}
            toggleMarkDone={id => console.log(`Toggle mark done ${id}`)}
            onEditTask={(id, data) => console.log(`Edit ${id} with ${JSON.stringify(data)}`)}
          />
        ))}
        <Button
          className={clsx(
            styles.addColumnVerticalButton,
            !columns.length && styles.addColumnVerticalButton_fullWidth,
          )}
        >
          <AddIcon /> Add Column
        </Button>
      </div>
    </div>
  );
};
