import { Button, Input, Tag } from '@ui-kit';
import styles from './ControlPanel.module.scss';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';
import {
  deleteSelectedTasks,
  markSelectedDone,
  markSelectedUndone,
  setFilter,
  setSearchQuery,
} from '@store/taskBoard';
import { Fragment } from 'react';
import type { QuickFilter } from '@store/taskBoard/types.ts';
import { debounce } from '@shared-utils';

export const ControlPanel = () => {
  const dispatch = useAppDispatch();

  const tasksSelected = useAppSelector(state => state.taskBoard.preferences.selectedTaskIds);
  const quickFilter = useAppSelector(state => state.taskBoard.preferences.filter);

  const onMarkSelectedDone = () => dispatch(markSelectedDone());
  const onMarkSelectedUndone = () => dispatch(markSelectedUndone());
  const onDeleteSelected = () => dispatch(deleteSelectedTasks());
  const onSetQuickFilter = (filter: QuickFilter) => dispatch(setFilter(filter));
  const onSearch = debounce((search: string) => dispatch(setSearchQuery(search)));

  const handleChangeQuickFilter = (filter: QuickFilter) => {
    if (quickFilter === filter) {
      return onSetQuickFilter('all');
    }
    onSetQuickFilter(filter);
  };

  return (
    <div className={styles.controlPanelWrapper}>
      <div className={styles.panelRow}>
        <Input
          placeholder="Search"
          onChange={({ target: { value } }) => onSearch(value)}
          className={styles.searchInput}
        />
        <span className={styles.noteText}>Quick Filters:</span>
        <div className={styles.tagsList}>
          <Tag
            name="quickFilter"
            checked={quickFilter === 'completed'}
            onChange={() => handleChangeQuickFilter('completed')}
            type="checkbox"
          >
            Complete tasks
          </Tag>
          <Tag
            name="quickFilter"
            checked={quickFilter === 'incomplete'}
            onChange={() => handleChangeQuickFilter('incomplete')}
            type="checkbox"
          >
            Incomplete tasks
          </Tag>
        </div>
      </div>
      <div className={styles.panelRow}>
        <span className={styles.noteText}>Bulk actions ({tasksSelected.size} selected):</span>
        {!tasksSelected.size ? (
          <span className={styles.noteText_placeholder}>Select at least 1 task</span>
        ) : (
          <Fragment>
            <Button size="sm" variant="filled" onClick={onMarkSelectedDone}>
              Mark as complete
            </Button>
            <Button size="sm" variant="filled" onClick={onMarkSelectedUndone}>
              Mark as incomplete
            </Button>
            <Button size="sm" variant="filled" onClick={onDeleteSelected}>
              Delete
            </Button>
          </Fragment>
        )}
      </div>
    </div>
  );
};
