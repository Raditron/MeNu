import { useState } from 'react'
import { AddMealModal } from '../AddMealModal/AddMealModal'
import type { AddMealButtonProps } from './interfaces/AddMealButton.interface'
import styles from './styles/AddMealButton.module.css'

export function AddMealButton({ onMealAdded }: AddMealButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" className={styles.addMealButton} onClick={() => setIsOpen(true)}>
        + Add Meal
      </button>
      {isOpen && <AddMealModal onClose={() => setIsOpen(false)} onAdded={onMealAdded} />}
    </>
  )
}
