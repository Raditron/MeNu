import { useMeals } from "../../meal/hooks/useMeals";
import { AddMealButton } from "./AddMealButton";
import { MealList } from "./MealList";

export function MenuPage() {
  const { meals, loading, refetch } = useMeals();

  return (
    <section className="menu-page">
      <div className="menu-page-header">
        <div>
          <h1>Menu</h1>
          <h2>What do we feel like today?</h2>
        </div>
        <AddMealButton onMealAdded={refetch} />
      </div>
      {loading ? <p>Loading meals…</p> : <MealList meals={meals} />}
    </section>
  );
}
