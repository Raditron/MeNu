import { FiEdit2 } from "react-icons/fi";
import type { EditButtonProps } from "./interfaces/EditButton.interface";
import styles from "./styles/EditButton.module.css";

export function EditButton({ onPress }: EditButtonProps) {
  return (
    <button
      type="button"
      className={styles.editButton}
      aria-label="Edit meal"
      onClick={onPress}
    >
      <FiEdit2 />
    </button>
  );
}
