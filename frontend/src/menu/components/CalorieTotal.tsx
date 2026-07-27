interface CalorieTotalProps {
  calories: number
}

export function CalorieTotal({ calories }: CalorieTotalProps) {
  return (
    <p className="calorie-total">
      Total: <strong>{Math.round(calories)}</strong> cal
    </p>
  )
}
