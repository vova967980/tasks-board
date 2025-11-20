import type { FC } from 'react';
import styles from './TaskCard.module.scss';
import { DeleteIcon, SaveIcon } from '@assets';
import { Button } from '@ui-kit';
import { TaskForm } from './taskForm';
import clsx from 'clsx';

interface TaskCardDraftProps {
  onRemove: () => void;
  onSave: () => void;
}

export const TaskCardDraft: FC<TaskCardDraftProps> = ({ onSave, onRemove }) => {
  return (
    <div className={clsx(styles.cardWrapper, styles.cardWrapper_draft)}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIdentifier}>Draft</span>
        <div className={styles.actionButtonsGroup}>
          <Button title="Save" onClick={onSave} variant="icon">
            <SaveIcon />
          </Button>
          <Button title="DeleteIcon" onClick={onRemove} variant="iconDanger">
            <DeleteIcon />
          </Button>
        </div>
      </div>
      <TaskForm />
    </div>
  );
};
