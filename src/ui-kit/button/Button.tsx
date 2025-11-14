import type {FC, ReactNode} from "react";
import styles from "./Button.module.scss";


interface ButtonProps {
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Button: FC<ButtonProps> = ({children, onClick}) => {
    return (
        <button onClick={onClick} className={styles.buttonContainer}>
            {children}
        </button>
    );
};
