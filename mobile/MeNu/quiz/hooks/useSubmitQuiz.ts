import { useCallback, useState } from 'react';

import type { Meal } from '@menu/domain/types/meal';
import type { Mood } from '@menu/domain/types/mood';
import { useAuth } from '@/auth/hooks/useAuth';
import { submitQuiz as submitQuizRequest } from '../../meal/api';

export function useSubmitQuiz() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [meals, setMeals] = useState<Meal[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitQuiz = useCallback(
    (mood: Mood) => {
      if (!uid) return Promise.resolve();
      setSubmitting(true);
      setError(null);
      return submitQuizRequest(uid, mood)
        .then((result) => setMeals(result))
        .catch((err: Error) => setError(err))
        .finally(() => setSubmitting(false));
    },
    [uid],
  );

  return { meals, submitting, error, submitQuiz };
}
