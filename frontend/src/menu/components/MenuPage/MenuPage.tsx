import { useMemo, useState } from "react";
import { useMeals } from "../../../meal/hooks/useMeals";
import { AddMealButton } from "../AddMealButton/AddMealButton";
import { MealList } from "../MealList/MealList";
import { MealSearchBar } from "../MealSearchBar/MealSearchBar";
import styles from "./styles/MenuPage.module.css";
import type { Meal } from "@menu/domain/types/meal";

export function MenuPage() {
  const { meals, loading, refetch } = useMeals();
  const [typeInput, setTypeInput] = useState("");
  const filtered: Meal[] = useMemo(
    () =>
      meals.filter(x => x.name.toLowerCase().includes(typeInput.toLowerCase())),
    [meals, typeInput],
  );
  return (
    <section>
      <div className={styles.menuPageHeader}>
        <div>
          <h1>Menu</h1>
          <h2>What do we feel like today?</h2>
        </div>
        <AddMealButton onMealAdded={refetch} />
      </div>
      <div className={styles.searchSection}>
        <p className={styles.searchLabel}>Looking for something specific?</p>
        <MealSearchBar value={typeInput} onChange={setTypeInput} />
      </div>
      {loading ? <p>Loading meals…</p> : <MealList meals={filtered} />}
      {!loading && meals.length === 0 && <p>No meals yet.</p>}
    </section>
  );
}
