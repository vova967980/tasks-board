import { AddIcon } from '@assets';
import { Column, ControlPanel } from '../../components';
import styles from './taskBoard.module.scss';
import { Button } from '@ui-kit';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addColumn } from '@store/taskBoard';

export const TaskBoard = () => {
  const dispatch = useAppDispatch();

  const columns = useAppSelector(state => state.taskBoard.columns);

  const onAddColumn = () => dispatch(addColumn());

  return (
    <div className={styles.boardWrapper}>
      <ControlPanel />
      <div className={styles.columnsWrapper}>
        {columns.order.map((columnId, index) => (
          <Column key={`column-${columnId}`} columnId={columnId} columnIndex={index} />
        ))}
        <Button
          className={clsx(
            styles.addColumnVerticalButton,
            !columns.order.length && styles.addColumnVerticalButton_fullWidth,
          )}
          onClick={onAddColumn}
        >
          <AddIcon /> Add Column
        </Button>
      </div>
    </div>
  );
};
