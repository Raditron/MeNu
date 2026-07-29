import { View } from 'react-native';

import { TagBadge } from '../TagBadge/TagBadge';
import type { TagBadgeListProps } from './interfaces/TagBadgeList.interface';
import { styles } from './styles/TagBadgeList.styles';

export function TagBadgeList({ tagValues }: TagBadgeListProps) {
  return (
    <View style={styles.list}>
      {tagValues.map((tagValue) => (
        <TagBadge key={tagValue.title} tagValue={tagValue} />
      ))}
    </View>
  );
}
