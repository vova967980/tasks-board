import { useCallback, useEffect, useRef } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/entry-point/element/adapter';
import styles from '../components/taskCard/TaskCard.module.scss';
import { moveTask, moveTaskGroup } from '@store/taskBoard';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';

interface UseDragDropTaskProps {
  columnId: number;
  index: number;
  id: string;
}

export const useDragDropTask = ({ columnId, index, id }: UseDragDropTaskProps) => {
  const dispatch = useAppDispatch();

  const selectedTaskIds = useAppSelector(state => state.taskBoard.preferences.selectedTaskIds);
  const taskIdsInColumn = useAppSelector(
    state => state.taskBoard.columns.entities[columnId].taskIds,
  );

  const ref = useRef<HTMLDivElement>(null);

  const getGroupIndex = useCallback(() => {
    const selectedArr = Array.from(selectedTaskIds);

    if (!selectedArr.includes(id)) return index;

    const idsInColumn = selectedArr.filter(tid => taskIdsInColumn.includes(tid));

    if (!idsInColumn.length) return index;

    return taskIdsInColumn.indexOf(idsInColumn[0]);
  }, [selectedTaskIds, id, index, taskIdsInColumn]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => {
          const selectedArray = Array.from(selectedTaskIds);

          const isGroup = selectedArray.length > 1 && selectedArray.includes(id);

          return isGroup
            ? {
                type: 'task-group',
                columnId,
                taskIds: selectedArray.filter(tid => taskIdsInColumn.includes(tid)),
                index: getGroupIndex(), // anchor (верхняя задача группы)
              }
            : {
                type: 'task',
                taskId: id,
                columnId,
                index,
              };
        },
        onDragStart: ({ source }) => {
          const data = source.data;

          if (data.type === 'task-group') {
            const ids = data.taskIds as string[];

            ids.forEach(taskId => {
              const taskEl = document.querySelector(
                `[data-task-id="${taskId}"]`,
              ) as HTMLElement | null;
              taskEl?.classList.add(styles.groupDragging);
            });
          } else {
            el.classList.add(styles.cardDragging);
          }
        },
        onDrop: ({ source }) => {
          const data = source.data;

          if (data.type === 'task-group') {
            const ids = data.taskIds as string[];

            ids.forEach(taskId => {
              const taskEl = document.querySelector(
                `[data-task-id="${taskId}"]`,
              ) as HTMLElement | null;
              taskEl?.classList.remove(styles.groupDragging);
            });
          }

          el.classList.remove(styles.cardDragging);
        },
      }),

      dropTargetForElements({
        element: el,
        getData: () => {
          return {
            type: 'task-target',
            taskId: id,
            columnId,
            index,
          };
        },
        onDrop: ({ source, self }) => {
          // GROUP MOVE
          if (source.data.type === 'task-group') {
            const fromColumn = source.data.columnId as number;
            const toColumn = self.data.columnId as number;
            const ids = source.data.taskIds as string[];

            dispatch(
              moveTaskGroup({
                taskIds: ids,
                sourceColumnId: fromColumn,
                destinationColumnId: toColumn,
                sourceIndex: source.data.index as number,
                destinationIndex: self.data.index as number,
              }),
            );
            return;
          }

          // SINGLE MOVE
          if (source.data.type !== 'task') return;

          const fromTaskId = source.data.taskId as string;
          const fromColumnId = source.data.columnId as number;
          const fromIndex = source.data.index as number;

          const toColumnId = self.data.columnId as number;
          const toIndex = self.data.index as number;

          if (fromTaskId === self.data.taskId && fromColumnId === toColumnId) return;

          dispatch(
            moveTask({
              taskId: fromTaskId,
              sourceColumnId: fromColumnId,
              destinationColumnId: toColumnId,
              sourceIndex: fromIndex,
              destinationIndex: toIndex,
            }),
          );
        },
      }),
    );
  }, [id, index, columnId, dispatch, selectedTaskIds, taskIdsInColumn, getGroupIndex]);

  return {
    ref,
  };
};
