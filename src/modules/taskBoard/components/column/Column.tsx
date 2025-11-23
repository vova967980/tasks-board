import styles from './column.module.scss';
import { Button, CheckboxWithLabel } from '@ui-kit';
import { AddIcon, DeleteIcon, DragIndicatorIcon } from '@assets';
import { TaskCard } from '../taskCard';
import { type FC, useEffect, useState } from 'react';
import type { TaskFormData } from '../../types';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';
import {
  addTask,
  removeColumn,
  removeTask,
  selectMany,
  selectTask,
  tasksFilteredByColumnSelector,
  tasksSelectionByColumnSelector,
  updateTask,
} from '@store/taskBoard';
import { TaskCardDraft } from '../taskCard/TaskCardDraft.tsx';
import type { Task } from '@store/taskBoard/types.ts';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { taskFormSchema } from '../../utils';
import clsx from 'clsx';
import { useDragDropColumn } from '../../hooks';

interface ColumnProps {
  columnId: number;
  columnIndex: number;
}

export const Column: FC<ColumnProps> = ({ columnId, columnIndex }) => {
  const [isDraftTask, setIsDraftTask] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(tasksFilteredByColumnSelector(columnId));
  const tasksOrder = useAppSelector(state => state.taskBoard.columns.entities[columnId].taskIds);
  const selectAllState = useAppSelector(tasksSelectionByColumnSelector(columnId));
  const tasksSelected = useAppSelector(state => state.taskBoard.preferences.selectedTaskIds);
  const taskIds = tasks.map(t => t.id);

  const methodsDraftTask = useForm<TaskFormData>({
    defaultValues: { title: '', description: '' },
    resolver: yupResolver(taskFormSchema),
  });

  const onSelectAll = (selected: boolean) => dispatch(selectMany({ ids: taskIds, selected }));
  const onRemoveColumn = () => dispatch(removeColumn({ columnId }));
  const onAddTask = (task: TaskFormData) => dispatch(addTask({ columnId, task }));
  const onRemoveTask = (taskId: string) => dispatch(removeTask({ taskId }));
  const onUpdateTask = (taskId: string, updates: Partial<Task>) =>
    dispatch(updateTask({ taskId, updates }));
  const onSelectTask = (taskId: string, selected: boolean) =>
    dispatch(selectTask({ taskId, selected }));

  useEffect(() => {
    if (isDraftTask) {
      methodsDraftTask.setFocus('title');
    }
  }, [isDraftTask, methodsDraftTask]);

  const { isDraggingTask, ref, handleRef, dropZoneRef } = useDragDropColumn({columnIndex, columnId});

  const handleClickAddTask = () => {
    setIsDraftTask(true);
    methodsDraftTask.setFocus('title');
  };
  const handleRemoveDraft = () => {
    setIsDraftTask(false);
    methodsDraftTask.reset();
  };
  const handleCreateTask = (task: TaskFormData) => {
    onAddTask(task);
    handleRemoveDraft();
    methodsDraftTask.reset();
  };
  const toggleTaskStatus = (task: Task) => {
    onUpdateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' });
  };

  return (
    <div ref={ref} className={styles.columnContainer}>
      <div className={styles.columnHeader}>
        <CheckboxWithLabel
          className={styles.labeledCheckbox}
          onChange={onSelectAll}
          checked={selectAllState.all}
          disabled={!tasks.length}
          indeterminate={selectAllState.indeterminate}
        >
          Select All
        </CheckboxWithLabel>
        <div className={styles.columnActionsWrapper}>
          <Button ref={handleRef} size="sm" variant="icon" className={styles.moveColumnButton}>
            <DragIndicatorIcon />
          </Button>
          <Button size="sm" variant="iconDanger" onClick={onRemoveColumn}>
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <div className={styles.columnBody}>
        <Button onClick={handleClickAddTask}>
          <AddIcon /> Add Task
        </Button>
        {isDraftTask && (
          <FormProvider {...methodsDraftTask}>
            <TaskCardDraft
              onSave={methodsDraftTask.handleSubmit(handleCreateTask)}
              onRemove={handleRemoveDraft}
            />
          </FormProvider>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            index={tasksOrder.indexOf(task.id)}
            {...task}
            columnId={columnId}
            isSelected={tasksSelected.has(task.id)}
            onRemove={() => onRemoveTask(task.id)}
            toggleSelect={() => onSelectTask(task.id, !tasksSelected.has(task.id))}
            toggleMarkDone={() => toggleTaskStatus(task)}
            onEdit={data => onUpdateTask(task.id, data)}
          />
        ))}
        <div
          ref={dropZoneRef}
          className={clsx(styles.dropZone, isDraggingTask && styles.dropZone_dragging)}
        />
      </div>
    </div>
  );
};
