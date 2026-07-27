import type { CalorieTotalProps } from './interfaces/CalorieTotal.interface'
import styles from './styles/CalorieTotal.module.css'

export function CalorieTotal({ calories }: CalorieTotalProps) {
  return (
    <p className={styles.calorieTotal}>
      Total: <strong>{Math.round(calories)}</strong> cal
    </p>
  )
}
