import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Circle, Line, Svg } from 'react-native-svg';

import { useAppTheme } from '@/theme';
import type { MealSearchBarProps } from './interfaces/MealSearchBar.interface';
import { styles } from './styles/MealSearchBar.styles';

/** Feather-style search/x glyphs via `react-native-svg`, same approach as `TabIcon` (ADR-0004). */
function SearchIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <Svg accessible={false} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={11} cy={11} r={8} />
      <Line x1={21} y1={21} x2={16.65} y2={16.65} />
    </Svg>
  );
}

function ClearIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg accessible={false} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Line x1={18} y1={6} x2={6} y2={18} />
      <Line x1={6} y1={6} x2={18} y2={18} />
    </Svg>
  );
}

export function MealSearchBar({ value, onChange }: MealSearchBarProps) {
  const theme = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.ring, isFocused && { borderColor: theme.accentBg }]}>
      <View
        style={[
          styles.searchBar,
          { borderColor: isFocused ? theme.accentBorder : theme.borderSubtle, backgroundColor: theme.surface },
          theme.shadowCard,
        ]}
      >
        <View style={styles.iconWrap} pointerEvents="none">
          <SearchIcon color={theme.textSoft} />
        </View>
        <TextInput
          testID="meal-search-input"
          style={[styles.input, { color: theme.textH }]}
          placeholder="Use the search engine"
          placeholderTextColor={theme.textSoft}
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value.length > 0 && (
          <Pressable
            testID="meal-search-clear"
            accessibilityLabel="Clear search"
            style={styles.clearButton}
            onPress={() => onChange('')}
          >
            {({ pressed }) => <ClearIcon color={pressed ? theme.accent5 : theme.textSoft} />}
          </Pressable>
        )}
      </View>
    </View>
  );
}
