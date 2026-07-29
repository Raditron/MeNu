import { Text, View } from 'react-native';

import { useAppTheme } from '@/theme';
import type { TagBadgeProps } from './interfaces/TagBadge.interface';
import { styles } from './styles/TagBadge.styles';

export function TagBadge({ tagValue }: TagBadgeProps) {
  const theme = useAppTheme();

  return (
    <View style={[styles.badge, { backgroundColor: theme.tagBg }]}>
      <Text style={[styles.text, { color: theme.tagText }]}>{tagValue.title}</Text>
    </View>
  );
}
