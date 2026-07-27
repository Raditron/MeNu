import { useState } from 'react'
import { useCategories } from '../../meal/hooks/useCategories'
import type { Mood } from '../../meal/types/mood'
import type { TagValue } from '../../meal/types/tagValue'

function toggleTagValue(values: TagValue[], value: TagValue): TagValue[] {
  const isSelected = values.some((existing) => existing.title === value.title)
  return isSelected ? values.filter((existing) => existing.title !== value.title) : [...values, value]
}

export function useQuizWizard() {
  const { categories, loading } = useCategories()
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedByStep, setSelectedByStep] = useState<TagValue[][]>([])
  const [mood, setMood] = useState<Mood | null>(null)

  const selections = selectedByStep[stepIndex] ?? []
  const currentCategory = categories[stepIndex]
  const canGoNext = currentCategory !== undefined && selections.length > 0

  function selectOption(option: TagValue) {
    if (!currentCategory) return
    const isSingleSelect = currentCategory.selectionMode === 'single'
    const updatedSelections = isSingleSelect ? [option] : toggleTagValue(selections, option)

    setSelectedByStep((prev) => {
      const next = [...prev]
      while (next.length <= stepIndex) next.push([])
      next[stepIndex] = updatedSelections
      return next
    })

    if (isSingleSelect) advance(updatedSelections)
  }

  function advance(currentSelections: TagValue[]) {
    if (stepIndex === categories.length - 1) {
      const byStep = [...selectedByStep]
      byStep[stepIndex] = currentSelections
      setMood({
        meatType: byStep[0][0],
        sideType: byStep[1][0],
        cuisineStyles: byStep[2] ?? [],
        flavorProfiles: byStep[3] ?? [],
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
