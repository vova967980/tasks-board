import { useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/entry-point/element/adapter';
import { moveColumn, moveTask, moveTaskGroup } from '@store/taskBoard';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';

interface UseDragDropColumnProps {
  columnIndex: number;
  columnId: number;

}

export const useDragDropColumn = ({columnIndex, columnId}: UseDragDropColumnProps) => {
  const dispatch = useAppDispatch();
  const [isDraggingTask, setIsDraggingTask] = useState(false);

  const tasksOrder = useAppSelector(state => state.taskBoard.columns.entities[columnId].taskIds);

  const ref = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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
        const toColumnId = self.data.columnId as number;

        // GROUP MOVE
        if (source.data.type === 'task-group') {
          const fromColumnId = source.data.columnId as number;
          const taskIds = source.data.taskIds as string[];
          const sourceIndex = source.data.index as number;

          dispatch(
            moveTaskGroup({
              taskIds,
              sourceColumnId: fromColumnId,
              destinationColumnId: toColumnId,
              sourceIndex,
              destinationIndex: tasksOrder.length,
            }),
          );

          return;
        }

        // SINGLE MOVE
        if (source.data.type !== 'task') return;

        const taskId = source.data.taskId as string;
        const fromColumnId = source.data.columnId as number;
        const fromIndex = source.data.index as number;

        dispatch(
          moveTask({
            taskId,
            sourceColumnId: fromColumnId,
            destinationColumnId: toColumnId,
            sourceIndex: fromIndex,
            destinationIndex: tasksOrder.length, // в конец колонки
          }),
        );
      },
    });
  }, [columnId, dispatch, tasksOrder.length]);

  useEffect(() => {
    return monitorForElements({
      onDragStart: ({ source }) => {
        if (source.data.type === 'task' || source.data.type === 'task-group') {
          setIsDraggingTask(true);
        }
      },
      onDrop: () => {
        setIsDraggingTask(false);
      },
    });
  }, []);

  return {
    isDraggingTask,
    ref,
    handleRef,
    dropZoneRef,
  };
};
