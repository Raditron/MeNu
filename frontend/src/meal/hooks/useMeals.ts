import { useCallback, useEffect, useState } from "react";
import { useGetUserUid } from "../../auth/hooks/useGetUserUid";
import { listMeals } from "../api";
import type { Meal } from "../types/meal";
import { useAddMeal } from "./useAddMeal";
import type { NewMeal } from "../api";

export function useMeals() {
  const { uid } = useGetUserUid();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { addMeal: addMealRequest, submitting } = useAddMeal();

  const refetch = useCallback(() => {
    if (!uid) {
      setMeals([]);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return listMeals(uid).then(result => {
      setMeals(result);
      setLoading(false);
    });
  }, [uid]);

  const addMeal = useCallback(
    (meal: NewMeal) => addMealRequest(meal).then(() => refetch()),
    [addMealRequest, refetch],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { meals, loading, refetch, addMeal, addingMeal: submitting };
}
