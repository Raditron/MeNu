import { Link } from "react-router-dom";
import type { MealHistoryEntryRowProps } from "./interfaces/MealHistoryEntryRow.interface";
import { TagBadgeList } from "../TagBadgeList/TagBadgeList";
import styles from "./styles/MealHistoryEntryRow.module.css";

export function MealHistoryEntryRow({ entry }: MealHistoryEntryRowProps) {
  return (
    <li className={styles.row}>
      <div className={styles.header}>
        <Link to={`/menu/${entry.mealId}`} className={styles.mealName}>
          {entry.mealName}
        </Link>
        <p className={styles.date}>
          {new Date(entry.date).toLocaleDateString()}
        </p>
      </div>
      <TagBadgeList
        tagValues={[
          entry.meatType,
          entry.sideType,
          ...entry.cuisineStyles,
          ...entry.flavorProfiles,
        ]}
      />
    </li>
  );
}
