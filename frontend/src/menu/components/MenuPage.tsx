import { useMeals } from '../../meal/hooks/useMeals'
import { AddMealButton } from './AddMealButton'
import { MealList } from './MealList'

export function MenuPage() {
  const { meals, loading, refetch } = useMeals()

  return (
    <section className="menu-page">
      <div className="menu-page-header">
        <h1>Menu</h1>
        <AddMealButton onMealAdded={refetch} />
      </div>
      {loading ? <p>Loading meals…</p> : <MealList meals={meals} />}
    </section>
  )
}
