import type { Meal } from '@menu/domain/types/meal';

export interface MealCardProps {
  meal: Meal;
  matchScore?: number;
  editable?: boolean;
}
