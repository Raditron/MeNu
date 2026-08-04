import { useState } from 'react'
import { useCategories } from '../../meal/hooks/useCategories'
import type { Mood } from '@menu/domain/types/mood'
import type { TagValue } from '@menu/domain/types/tagValue'

function toggleTagValue(values: TagValue[], value: TagValue): TagValue[] {
  const isSelected = values.some((existing) => existing.title === value.title)
  return isSelected ? values.filter((existing) => existing.title !== value.title) : [...values, value]
}

export function useQuizWizard() {
  const { categories, loading } = useCategories()
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedByStep, setSelectedByStep] = useState<(TagValue[] | null)[]>([])
  const [mood, setMood] = useState<Mood | null>(null)

  const selections = selectedByStep[stepIndex] ?? []
  const currentCategory = categories[stepIndex]
  const canGoNext = currentCategory !== undefined && selections.length > 0

  function setStepSelections(value: TagValue[] | null) {
    setSelectedByStep((prev) => {
      const next = [...prev]
      while (next.length <= stepIndex) next.push([])
      next[stepIndex] = value
      return next
    })
  }

  function selectOption(option: TagValue | null) {
    if (!currentCategory) return

    if (option === null) {
      setStepSelections(null)
      advance(null)
      return
    }

    const isSingleSelect = currentCategory.selectionMode === 'single'
    const updatedSelections = isSingleSelect ? [option] : toggleTagValue(selections, option)
    setStepSelections(updatedSelections)

    if (isSingleSelect) advance(updatedSelections)
  }

  function advance(currentSelections: TagValue[] | null) {
    if (stepIndex === categories.length - 1) {
      const byStep = [...selectedByStep]
      byStep[stepIndex] = currentSelections
      setMood({
        meatType: byStep[0]![0],
        sideType: byStep[1]![0],
        cuisineStyles: byStep[2] ?? null,
        flavorProfiles: byStep[3] ?? null,
      })
      return
    }
    setStepIndex((index) => index + 1)
  }

  function goNext() {
    if (!canGoNext) return
    advance(selections)
  }

  function goBack() {
    setStepIndex((index) => Math.max(0, index - 1))
  }

  function restart() {
    setStepIndex(0)
    setSelectedByStep([])
    setMood(null)
  }

  return {
    loading,
    categories,
    stepIndex,
    currentCategory,
    selections,
    canGoNext,
    mood,
    selectOption,
    goNext,
    goBack,
    restart,
  }
}
