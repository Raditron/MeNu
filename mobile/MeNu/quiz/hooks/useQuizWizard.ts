import { useState } from 'react';

import type { TagValue } from '@menu/domain/types/tagValue';
import { useCategories } from '../../meal/hooks/useCategories';

function toggleTagValue(values: TagValue[], value: TagValue): TagValue[] {
  const isSelected = values.some((existing) => existing.title === value.title);
  return isSelected ? values.filter((existing) => existing.title !== value.title) : [...values, value];
}

export function useQuizWizard() {
  const { categories, loading } = useCategories();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedByStep, setSelectedByStep] = useState<TagValue[][]>([]);

  const selections = selectedByStep[stepIndex] ?? [];
  const currentCategory = categories[stepIndex];

  function selectOption(option: TagValue) {
    if (!currentCategory) return;
    const isSingleSelect = currentCategory.selectionMode === 'single';
    const updatedSelections = isSingleSelect ? [option] : toggleTagValue(selections, option);

    setSelectedByStep((prev) => {
      const next = [...prev];
      while (next.length <= stepIndex) next.push([]);
      next[stepIndex] = updatedSelections;
      return next;
    });

    if (isSingleSelect) {
      setStepIndex((index) => Math.min(index + 1, categories.length - 1));
    }
  }

  return {
    loading,
    categories,
    stepIndex,
    currentCategory,
    selections,
    selectOption,
  };
}
