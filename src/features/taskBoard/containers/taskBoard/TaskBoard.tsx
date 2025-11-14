import {Column} from "../../components";
import styles from './taskBoard.module.scss'

export const TaskBoard = () => {
    return (
        <div className={styles.boardWrapper}>
            TASK BOARD

            <div className={styles.columnsWrapper}>
                <Column/>
                <Column/>
            </div>
        </div>
    );
};
