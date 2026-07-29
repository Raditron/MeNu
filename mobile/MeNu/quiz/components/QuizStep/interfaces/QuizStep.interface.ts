import type { Category } from '@menu/domain/types/category';
import type { TagValue } from '@menu/domain/types/tagValue';

export interface QuizStepNavigation {
  canGoBack: boolean;
  onBack: () => void;
  canGoNext: boolean;
  onNext: () => void;
}

export interface QuizStepProps {
  stepNumber: number;
  stepCount: number;
  category: Category;
  selections: TagValue[];
  onSelect: (tagValue: TagValue) => void;
  navigation: QuizStepNavigation;
}
