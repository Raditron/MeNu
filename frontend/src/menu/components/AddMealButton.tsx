import { useState } from 'react'
import { AddMealModal } from './AddMealModal'

interface AddMealButtonProps {
  onMealAdded: () => void
}

export function AddMealButton({ onMealAdded }: AddMealButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" className="add-meal-button" onClick={() => setIsOpen(true)}>
        + Add Meal
      </button>
      {isOpen && <AddMealModal onClose={() => setIsOpen(false)} onAdded={onMealAdded} />}
    </>
  )
}
