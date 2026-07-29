import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import type { MatchBadgeProps } from './interfaces/MatchBadge.interface';
import { styles } from './styles/MatchBadge.styles';

export function MatchBadge({ matchScore }: MatchBadgeProps) {
  const theme = useAppTheme();
  const percent = Math.round(matchScore * 100);

  return (
    <View style={[styles.badge, { backgroundColor: theme.accent }]}>
      <Text style={[styles.text, { color: theme.accentCtaText }]}>{percent}% match</Text>
    </View>
  );
}
