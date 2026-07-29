import type { Category } from '@menu/domain/types/category';
import type { TagValue } from '@menu/domain/types/tagValue';

export interface QuizStepProps {
  stepNumber: number;
  stepCount: number;
  category: Category;
  selections: TagValue[];
  onSelect: (tagValue: TagValue) => void;
}
