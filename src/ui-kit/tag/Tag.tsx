import type { FC, ReactNode } from 'react';
import styles from './Tag.module.scss';
import clsx from 'clsx';

interface TagProps {
  children?: ReactNode;
  className?: string;
}

export const Tag: FC<TagProps> = ({ children, className }) => {
  return <div className={clsx(styles.tagWrapper, className)}>{children}</div>;
};
