import type { TagValue } from '@menu/domain/types/tagValue';

export interface QuizOptionListProps {
  label: string;
  options: TagValue[];
  selections: TagValue[];
  onSelect: (tagValue: TagValue) => void;
}
