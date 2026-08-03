import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { calculateCalories } from "@menu/domain/utils/calculateCalories";
import { getYoutubeEmbedUrl } from "@menu/domain/utils/getYoutubeEmbedUrl";
import { useMeal } from "../../../meal/hooks/useMeal";
import { getIngredientIcon } from "../../../meal/utils/ingredientIcons";
import { TagBadgeList } from "../../../meal/components/TagBadgeList/TagBadgeList";
import styles from "./styles/MealDetailsPage.module.css";

export function MealDetailsPage() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const { meal, loading } = useMeal(mealId ?? "");

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
      <h1>{meal.name}</h1>
      <p className={styles.portions}>
        {meal.meatType.tagValue.title} ({meal.meatType.grams}g) ·{" "}
        {meal.sideType.tagValue.title} ({meal.sideType.grams}g)
      </p>
      <TagBadgeList
        tagValues={[...meal.cuisineStyles, ...meal.flavorProfiles]}
      />
      <p className={styles.calories}>{Math.round(calories)} cal</p>
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
        <p className={styles.noVideo}>No video attached, edit the meal to add one.</p>
      )}
    </section>
  );
}
