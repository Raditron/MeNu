import type { Dispatch, SetStateAction } from 'react';

export interface MealSearchBarProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}
