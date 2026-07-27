const ICONS_BY_CATEGORY: Record<string, Record<string, string>> = {
  'Meat Type': { pork: '🐖', chicken: '🍗', shrimp: '🦐', beef: '🥩' },
  'Side Type': { salad: '🥗', potatoes: '🥔', rice: '🍚', pasta: '🍝' },
}

export function getTagIcon(categoryName: string, title: string): string | undefined {
  return ICONS_BY_CATEGORY[categoryName]?.[title]
}
