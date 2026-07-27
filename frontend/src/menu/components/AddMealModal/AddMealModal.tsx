import type { FormEvent } from 'react'
import { useCategories } from '../../../meal/hooks/useCategories'
import type { IngredientTagValue } from '../../../meal/types/tagValue'
import { useAddMealForm } from '../../hooks/useAddMealForm'
import { CalorieTotal } from '../CalorieTotal/CalorieTotal'
import { IngredientSelectField } from '../fields/IngredientSelectField/IngredientSelectField'
import { MealNameField } from '../fields/MealNameField/MealNameField'
import { TagMultiSelectField } from '../fields/TagMultiSelectField/TagMultiSelectField'
import type { AddMealModalProps } from './interfaces/AddMealModal.interface'
import styles from './styles/AddMealModal.module.css'
import buttonStyles from '../../../shared/styles/button.module.css'

export function AddMealModal({ onClose, onAdded }: AddMealModalProps) {
  const { categories, loading } = useCategories()
  const form = useAddMealForm()

  const meatOptions = (categories.find((category) => category.name === 'Meat Type')?.options ??
    []) as IngredientTagValue[]
  const sideOptions = (categories.find((category) => category.name === 'Side Type')?.options ??
    []) as IngredientTagValue[]
  const cuisineOptions = categories.find((category) => category.name === 'Cuisine Style')?.options ?? []
  const flavorOptions = categories.find((category) => category.name === 'Flavor Profile')?.options ?? []

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const result = form.submit()
    if (!result) return
    result.then(() => {
      onAdded()
      onClose()
    })
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Add Meal</h2>
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
            <CalorieTotal calories={form.calories} />
            <div className={styles.modalActions}>
              <button type="button" className={buttonStyles.secondary} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={buttonStyles.primary} disabled={!form.canSubmit || form.submitting}>
                {form.submitting ? 'Adding…' : 'Add Meal'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
