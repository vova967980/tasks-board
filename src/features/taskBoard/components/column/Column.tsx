import styles from './column.module.scss';
import {Button} from "@ui-kit";
import {AddIcon} from '@assets';

export const Column = () => {
    return (
        <div className={styles.columnContainer}>
            <Button><AddIcon/> <span>Task</span></Button>
            <div className={styles.columnBody}>
                column

            </div>
        </div>
    );
};
