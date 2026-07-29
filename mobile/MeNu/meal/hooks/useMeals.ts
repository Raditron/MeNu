import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/auth/hooks/useAuth';
import { listMeals } from '../api';
import type { Meal } from '@menu/domain/types/meal';

export function useMeals() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(() => {
    if (!uid) {
      setMeals([]);
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return listMeals(uid).then((result) => {
      setMeals(result);
      setLoading(false);
    });
  }, [uid]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { meals, loading, refetch };
}
