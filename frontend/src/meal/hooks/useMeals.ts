import { useCallback, useEffect, useState } from "react";
import { useGetUserUid } from "../../auth/hooks/useGetUserUid";
import { listMeals } from "../api";
import type { Meal } from "@menu/domain/types/meal";
import { useAddMeal } from "./useAddMeal";
import { useEditMeal } from "./useEditMeal";
import type { NewMeal } from "../api";

export function useMeals() {
  const { uid } = useGetUserUid();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { addMeal: addMealRequest, submitting } = useAddMeal();
  const { editMeal: editMealRequest, submitting: editingMeal } = useEditMeal();

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

  const editMeal = useCallback(
    (meal: Meal) => editMealRequest(meal).then(() => refetch()),
    [editMealRequest, refetch],
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { meals, loading, refetch, addMeal, addingMeal: submitting, editMeal, editingMeal };
}
