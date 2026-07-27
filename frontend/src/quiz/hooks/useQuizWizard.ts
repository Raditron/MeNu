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
    setSelectedByStep((prev) => {
      const next = [...prev]
      while (next.length <= stepIndex) next.push([])
      next[stepIndex] =
        currentCategory.selectionMode === 'single' ? [option] : toggleTagValue(next[stepIndex], option)
      return next
    })
  }

  function goNext() {
    if (!canGoNext) return
    if (stepIndex === categories.length - 1) {
      setMood({
        meatType: selectedByStep[0][0],
        sideType: selectedByStep[1][0],
        cuisineStyles: selectedByStep[2] ?? [],
        flavorProfiles: selectedByStep[3] ?? [],
      })
      return
    }
    setStepIndex((index) => index + 1)
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
