import type { TagValue } from '@menu/domain/types/tagValue';

export interface QuizOptionProps {
  label: string;
  tagValue: TagValue;
  selected: boolean;
  onSelect: (tagValue: TagValue) => void;
}
