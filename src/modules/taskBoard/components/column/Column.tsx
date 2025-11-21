import styles from './column.module.scss';
import { Button, CheckboxWithLabel } from '@ui-kit';
import { AddIcon, DeleteIcon, DragIndicatorIcon } from '@assets';
import { TaskCard } from '../taskCard';
import { type FC, useEffect, useRef, useState } from 'react';
import type { TaskFormData } from '../../types';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';
import {
  addTask,
  moveColumn,
  moveTask,
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
import { taskFormSchema } from '../taskCard/taskFormSchema.ts';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import clsx from 'clsx';

interface ColumnProps {
  columnId: number;
  columnIndex: number;
}

export const Column: FC<ColumnProps> = ({ columnId, columnIndex }) => {
  const [isDraftTask, setIsDraftTask] = useState<boolean>(false);
  const [isDraggingTask, setIsDraggingTask] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const element = ref.current;
    const dragHandle = handleRef.current;
    if (!element || !dragHandle) return;

    return combine(
      draggable({
        element,
        dragHandle,
        getInitialData: () => ({
          type: 'column',
          columnId,
          fromIndex: columnIndex,
        }),
      }),
      dropTargetForElements({
        element,
        getData: () => ({
          type: 'column',
          columnId,
          index: columnIndex,
        }),
        onDrop: ({ source, self }) => {
          if (source.data.type !== 'column') return;

          const fromIndex = source.data.fromIndex as number;
          const toIndex = self.data.index as number;

          if (fromIndex === toIndex) return;

          dispatch(
            moveColumn({
              fromIndex,
              toIndex,
            }),
          );
        },
      }),
    );
  }, [columnId, columnIndex, dispatch]);

  useEffect(() => {
    const el = dropZoneRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({
        type: 'column-drop',
        columnId,
      }),
      onDrop: ({ source, self }) => {
        if (source.data.type !== 'task') return;

        const taskId = source.data.taskId as string;
        const fromColumnId = source.data.columnId as number;
        const fromIndex = source.data.index as number;
        const toColumnId = self.data.columnId as number;

        dispatch(
          moveTask({
            taskId,
            sourceColumnId: fromColumnId,
            destinationColumnId: toColumnId,
            sourceIndex: fromIndex,
            destinationIndex: tasksOrder.length,
          }),
        );
      },
    });
  }, [columnId, dispatch, tasksOrder.length]);

  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => {
        if (source.data.type === 'task') {
          setIsDraggingTask(true);
        }
      },
      onDrop: () => {
        setIsDraggingTask(false);
      },
    });
  }, []);

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
