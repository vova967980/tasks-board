import { useState, type ComponentProps, type FC, type ReactNode, Fragment } from 'react';
import styles from './taskCard.module.scss';
import { Button, Checkbox } from '@ui-kit';
import {
  CheckAltIcon,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  PendingIcon,
  SaveIcon,
} from '@assets';
import type { TaskFormData, TaskStatus } from '../../types';
import clsx from 'clsx';
import { TaskForm } from './taskForm';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { taskFormSchema } from '../../utils';
import { useDragDropTask } from '../../hooks';

interface TaskCardProps {
  id: string;
  columnId: number;
  index: number;
  title: string;
  description: string;
  status: TaskStatus;
  isSelected: boolean;
  onRemove: () => void;
  onEdit: (data: TaskFormData) => void;
  toggleMarkDone: () => void;
  toggleSelect: () => void;
}

const taskStatusIcon: Record<TaskStatus, ReactNode> = {
  todo: <PendingIcon className={styles.pendingIcon} />,
  done: <CheckIcon className={styles.doneIcon} />,
};

const renderIconButton = (
  icon: ReactNode,
  onClick: () => void,
  title: string,
  options?: Omit<ComponentProps<typeof Button>, 'onClick' | 'children' | 'title'>,
) => (
  <Button title={title} onClick={onClick} variant="icon" {...options}>
    {icon}
  </Button>
);

export const TaskCard: FC<TaskCardProps> = ({
  id,
  columnId,
  index,
  title,
  description,
  status,
  onRemove,
  onEdit,
  isSelected,
  toggleMarkDone,
  toggleSelect,
}) => {
  const [isEditing, setIsEditing] = useState(!id);
  const isDone = status === 'done';
  const completeButton: Record<TaskStatus, ReactNode> = {
    todo: renderIconButton(<CheckAltIcon />, toggleMarkDone, 'Mark as complete'),
    done: renderIconButton(<CloseIcon />, toggleMarkDone, 'Mark as incomplete'),
  };

  const { ref } = useDragDropTask({ id, index, columnId });

  const methods = useForm<TaskFormData>({
    defaultValues: { title, description },
    resolver: yupResolver(taskFormSchema),
  });

  const handleUpdateData = methods.handleSubmit(values => {
    onEdit(values);
    methods.reset(values);
    setIsEditing(false);
  });

  return (
    <div
      ref={ref}
      data-task-id={id}
      className={clsx(
        styles.cardWrapper,
        isSelected && styles.cardWrapper_selected,
        isDone && styles.cardWrapper_done,
        isEditing && styles.cardWrapper_editing,
      )}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardIdentifier}>{id}</span>
        <div className={styles.actionButtonsGroup}>
          {completeButton[status]}
          {isEditing
            ? renderIconButton(<SaveIcon />, handleUpdateData, 'Save')
            : renderIconButton(<EditIcon />, () => setIsEditing(true), 'Edit')}
          {renderIconButton(<DeleteIcon />, onRemove, 'Delete', {
            variant: 'iconDanger',
          })}
        </div>
      </div>
      {isEditing ? (
        <FormProvider {...methods}>
          <TaskForm />
        </FormProvider>
      ) : (
        <Fragment>
          <h4 className={styles.cardTitle} title={title}>
            {title}
          </h4>
          {description && (
            <p className={styles.cardDescription} title={description}>
              {description}
            </p>
          )}
        </Fragment>
      )}
      <div className={styles.cardFooter}>
        <div className={styles.cardStatus}>{taskStatusIcon[status]}</div>
        <Checkbox checked={isSelected} onChange={toggleSelect} />
      </div>
    </div>
  );
};
