import { useState } from "react";
import { calculateCalories } from "@menu/domain/utils/calculateCalories";
import { getIngredientIcon } from "../../utils/ingredientIcons";
import type { MealCardProps } from "./interfaces/MealCard.interface";
import styles from "./styles/MealCard.module.css";
import { MatchBadge } from "../MatchBadge/MatchBadge";
import { TagBadgeList } from "../TagBadgeList/TagBadgeList";
import { EditButton } from "./EditButton/EditButton";

export function MealCard({ meal, matchScore, renderEditModal, onPress }: MealCardProps) {
  const calories = calculateCalories(meal);
  const Icon = getIngredientIcon(meal.meatType.tagValue.icon);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article
      className={styles.mealCard}
      onClick={onPress}
      data-clickable={onPress ? "" : undefined}
    >
      <div className={styles.mealCardPicture} aria-hidden="true">
        {Icon ? <Icon /> : "🍽️"}
      </div>
      <div className={styles.mealCardBody}>
        <div className={styles.mealCardHeader}>
          <h3>{meal.name}</h3>
          {matchScore !== undefined && <MatchBadge matchScore={matchScore} />}
        </div>
        <p className={styles.mealCardPortions}>
          {meal.meatType.tagValue.title} ({meal.meatType.grams}g) ·{" "}
          {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
        </p>
        <TagBadgeList
          tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]}
        />
        <div className={styles.mealCardFooter}>
          <p className={styles.mealCardCalories}>
            {Math.round(calories)} cal
          </p>
          {renderEditModal && <EditButton onPress={() => setIsEditing(true)} />}
        </div>
      </div>
      {isEditing && renderEditModal?.({ meal, onClose: () => setIsEditing(false) })}
    </article>
  );
}
