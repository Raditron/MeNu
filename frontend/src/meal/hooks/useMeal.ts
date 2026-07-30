import { useEffect, useState } from "react";
import { useGetUserUid } from "../../auth/hooks/useGetUserUid";
import { getMealById } from "../api";
import type { Meal } from "@menu/domain/types/meal";

export function useMeal(mealId: string) {
  const { uid } = useGetUserUid();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setMeal(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMealById(uid, mealId).then(result => {
      setMeal(result);
      setLoading(false);
    });
  }, [uid, mealId]);

  return { meal, loading };
}
