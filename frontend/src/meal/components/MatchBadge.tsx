interface MatchBadgeProps {
  matchScore: number
}

export function MatchBadge({ matchScore }: MatchBadgeProps) {
  const percent = Math.round(matchScore * 100)
  return <span className="match-badge">{percent}% match</span>
}
