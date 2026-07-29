import { useMeals } from '../../../meal/hooks/useMeals'
import { AddMealButton } from '../AddMealButton/AddMealButton'
import { MealList } from '../MealList/MealList'
import styles from './styles/MenuPage.module.css'

export function MenuPage() {
  const { meals, loading, refetch } = useMeals()

  return (
    <section>
      <div className={styles.menuPageHeader}>
        <div>
          <h1>Menu</h1>
          <h2>What do we feel like today?</h2>
        </div>
        <AddMealButton onMealAdded={refetch} />
      </div>
      {loading ? <p>Loading meals…</p> : <MealList meals={meals} />}
      {!loading && meals.length === 0 && <p>No meals yet.</p>}
    </section>
  )
}
