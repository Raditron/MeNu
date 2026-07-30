import { FiSearch, FiX } from "react-icons/fi";
import type { MealSearchBarProps } from "./interfaces/MealSearchBar.interface";
import styles from "./styles/MealSearchBar.module.css";

export const MealSearchBar = ({ value, onChange }: MealSearchBarProps) => {
  return (
    
    <div className={styles.searchBar}>
      <FiSearch className={styles.searchIcon} />
      <input
        className={styles.searchInput}
        placeholder="Use the search engine"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <FiX />
        </button>
      )}
    </div>
  );
};
