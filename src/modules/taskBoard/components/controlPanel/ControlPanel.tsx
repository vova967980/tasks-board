import { Button, Input, Tag } from '@ui-kit';
import styles from './ControlPanel.module.scss';

export const ControlPanel = () => {
  return (
    <div className={styles.controlPanelWrapper}>
      <div className={styles.panelRow}>
        <Input placeholder="Search" className={styles.searchInput} />
        <span className={styles.noteText}>Quick Filters:</span>
        <div className={styles.tagsList}>
          <Tag>Complete tasks</Tag>
          <Tag>Incomplete tasks</Tag>
        </div>
      </div>
      <div className={styles.panelRow}>
        <span className={styles.noteText}>Bulk actions (0 selected):</span>
        {/*<span className={styles.noteText_placeholder}>Select at least 1 task</span>*/}
        <Button size="sm" variant="filled">
          Mark as complete
        </Button>
        <Button size="sm" variant="filled">
          Mark as incomplete
        </Button>
        <Button size="sm" variant="filled">
          Delete
        </Button>
      </div>
    </div>
  );
};
