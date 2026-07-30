import { Pressable } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { useAppTheme } from '@/theme';
import type { EditButtonProps } from './interfaces/EditButton.interface';
import { styles } from './styles/EditButton.styles';

/** Pencil glyph via `react-native-svg`, same approach as `TabIcon`/`MealSearchBar` (ADR-0004). */
function EditIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg accessible={false} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20h9" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </Svg>
  );
}

export function EditButton({ onPress }: EditButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      testID="meal-card-edit"
      accessibilityLabel="Edit meal"
      style={styles.button}
      onPress={event => {
        event.stopPropagation();
        onPress();
      }}
    >
      {({ pressed }) => <EditIcon color={pressed ? theme.accent5 : theme.textSoft} />}
    </Pressable>
  );
}
