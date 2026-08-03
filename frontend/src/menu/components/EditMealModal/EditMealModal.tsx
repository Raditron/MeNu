import type { FormEvent } from "react";
import { useCategories } from "../../../meal/hooks/useCategories";
import type { IngredientTagValue } from "@menu/domain/types/tagValue";
import { useEditMealForm } from "../../hooks/useEditMealForm";
import { CalorieTotal } from "../CalorieTotal/CalorieTotal";
import { IngredientSelectField } from "../fields/IngredientSelectField/IngredientSelectField";
import { MealNameField } from "../fields/MealNameField/MealNameField";
import { TagMultiSelectField } from "../fields/TagMultiSelectField/TagMultiSelectField";
import { YoutubeUrlField } from "../fields/YoutubeUrlField/YoutubeUrlField";
import type { EditMealModalProps } from "./interfaces/EditMealModal.interface";
import styles from "../AddMealModal/styles/AddMealModal.module.css";
import buttonStyles from "../../../shared/styles/button.module.css";
import { useMeals } from "../../../meal/hooks/useMeals";

export function EditMealModal({ meal, onClose, onEdited }: EditMealModalProps) {
  const { categories, loading } = useCategories();
  const { editMeal } = useMeals();
  const form = useEditMealForm(meal, editMeal);
  const meatOptions = (categories.find(
    category => category.name === "Meat Type",
  )?.options ?? []) as IngredientTagValue[];
  const sideOptions = (categories.find(
    category => category.name === "Side Type",
  )?.options ?? []) as IngredientTagValue[];
  const cuisineOptions =
    categories.find(category => category.name === "Cuisine Style")?.options ??
    [];
  const flavorOptions =
    categories.find(category => category.name === "Flavor Profile")?.options ??
    [];

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const result = form.submit();
    if (!result) return;
    result.then(() => {
      onEdited();
      onClose();
    });
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={event => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Edit Meal</h2>
        {loading ? (
          <p>Loading options…</p>
        ) : (
          <>
            <MealNameField value={form.name} onChange={form.setName} />
            <IngredientSelectField
              label="Meat Type"
              options={meatOptions}
              selection={form.meatType}
              onChange={form.setMeatType}
            />
            <IngredientSelectField
              label="Side Type"
              options={sideOptions}
              selection={form.sideType}
              onChange={form.setSideType}
            />
            <TagMultiSelectField
              label="Cuisine Style"
              options={cuisineOptions}
              selected={form.cuisineStyles}
              onToggle={form.toggleCuisineStyle}
            />
            <TagMultiSelectField
              label="Flavor Profile"
              options={flavorOptions}
              selected={form.flavorProfiles}
              onToggle={form.toggleFlavorProfile}
            />
            <YoutubeUrlField value={form.youtubeUrl} onChange={form.setYoutubeUrl} />
            <CalorieTotal calories={form.calories} />
            <div className={styles.modalActions}>
              <button
                type="button"
                className={buttonStyles.secondary}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={buttonStyles.primary}
                disabled={!form.canSubmit || form.submitting}
              >
                {form.submitting ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
