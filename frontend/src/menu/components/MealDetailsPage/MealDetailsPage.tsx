import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { calculateCalories } from "@menu/domain/utils/calculateCalories";
import { getYoutubeEmbedUrl } from "@menu/domain/utils/getYoutubeEmbedUrl";
import { useMeal } from "../../../meal/hooks/useMeal";
import { useEatMeal } from "../../../meal/hooks/useEatMeal";
import { getIngredientIcon } from "../../../meal/utils/ingredientIcons";
import { TagBadgeList } from "../../../meal/components/TagBadgeList/TagBadgeList";
import styles from "./styles/MealDetailsPage.module.css";

export function MealDetailsPage() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const { meal, loading } = useMeal(mealId ?? "");
  const { eatMeal, submitting, justAte, error } = useEatMeal(mealId ?? "");

  if (loading) {
    return <p>Loading meal…</p>;
  }

  if (!meal) {
    return (
      <section>
        <p>Meal not found.</p>
        <Link to="/menu">Back to Menu</Link>
      </section>
    );
  }

  const calories = calculateCalories(meal);
  const Icon = getIngredientIcon(meal.meatType.tagValue.icon);
  const embedUrl = getYoutubeEmbedUrl(meal.youtubeUrl);
  const lastEaten = meal.eatenHistory.at(-1);

  return (
    <section>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate("/menu")}
      >
        <FiArrowLeft /> Back to Menu
      </button>
      <div className={styles.picture} aria-hidden="true">
        {Icon ? <Icon /> : "🍽️"}
      </div>

      <div className={styles.detailsRow}>
        <div className={styles.mainInfo}>
          <h1>{meal.name}</h1>
          {lastEaten && (
            <p className={styles.lastEatenTag}>
              Last eaten on {new Date(lastEaten.date).toLocaleDateString()}
            </p>
          )}
          <p className={styles.portions}>
            {meal.meatType.tagValue.title} ({meal.meatType.grams}g) ·{" "}
            {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
          </p>
          <TagBadgeList
            tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]}
          />
        </div>
        <div className={styles.statsCard}>
          <div className={styles.statsMain}>
            <p className={styles.caloriesTotal}>{Math.round(calories)}</p>
            <span className={styles.caloriesLabel}>total calories</span>
          </div>
          <div className={styles.statsDivider} />
          <div className={styles.statsDetail}>
            <span className={styles.calPerPortion}>
              {Math.round(meal.calPerPortion)} cal/portion
            </span>
            <span className={styles.servings}>
              Serves {meal.numberOfPortions} portions
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={styles.eatButton}
        onClick={() => eatMeal()}
        disabled={submitting}
      >
        Mark as eaten
      </button>
      {justAte && <p className={styles.eatConfirmation}>Marked as eaten ✓</p>}
      {error && <p className={styles.eatError}>{error.message}</p>}

      {embedUrl ? (
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.video}
            src={embedUrl}
            title={`${meal.name} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className={styles.noVideo}>
          No video attached, edit the meal to add one.
        </p>
      )}
    </section>
  );
}
