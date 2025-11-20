import type { RootState } from '@store';
import { createSelector } from '@reduxjs/toolkit';

export const tasksFilteredByColumnSelector = (columnId: number) =>
  createSelector(
    [
      (state: RootState) => state.taskBoard.columns.entities[columnId]?.taskIds,
      (state: RootState) => state.taskBoard.tasks.entities,
      (state: RootState) => state.taskBoard.preferences.searchQuery,
      (state: RootState) => state.taskBoard.preferences.filter,
    ],
    (taskIds, taskEntities, searchQuery, filter) => {
      if (!taskIds) return [];

      const list = taskIds.map(id => taskEntities[id]);

      const withSearch = searchQuery
        ? list.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : list;

      const filtered =
        filter === 'all'
          ? withSearch
          : withSearch.filter(task =>
              filter === 'completed' ? task.status === 'done' : task.status !== 'done',
            );

      return filtered;
    },
  );

export const tasksSelectionByColumnSelector = (columnId: number) =>
  createSelector(
    [
      tasksFilteredByColumnSelector(columnId),
      (state: RootState) => state.taskBoard.preferences.selectedTaskIds,
      (state: RootState) => state.taskBoard.columns.entities[columnId]?.taskIds
    ],
    (filteredTasks, selectedTaskIds, columnTaskIds) => {
      const filteredIds = filteredTasks.map(t => t.id);
      const visibleCount = filteredIds.length;

      if (visibleCount === 0) {
        return { all: false, none: true, indeterminate: false };
      }

      const visibleSelectedCount = filteredIds.filter(id => selectedTaskIds.has(id)).length;
      const globalSelectedCount = columnTaskIds.filter(id => selectedTaskIds.has(id)).length;

      const all = visibleSelectedCount === visibleCount;
      const none = visibleSelectedCount === 0 && globalSelectedCount === 0;
      const indeterminate = !all && !none;

      return { all, none, indeterminate };
    },
  );
