import { Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

import { getIngredientIconPath, INGREDIENT_ICON_VIEW_BOX } from '../../utils/ingredientIcons';
import type { IngredientIconProps } from './interfaces/IngredientIcon.interface';
import { styles } from './styles/IngredientIcon.styles';

/** Mobile's `react-native-svg` counterpart of web's `getIngredientIcon()` (ADR-0004). */
export function IngredientIcon({ iconKey, size = 48, color = '#000000' }: IngredientIconProps) {
  const path = getIngredientIconPath(iconKey);

  if (!path) {
    return (
      <Text accessible={false} style={[styles.fallback, { fontSize: size * 0.7 }]}>
        🍽️
      </Text>
    );
  }

  return (
    <Svg testID="ingredient-icon-svg" accessible={false} width={size} height={size} viewBox={INGREDIENT_ICON_VIEW_BOX}>
      <Path d={path} fill={color} />
    </Svg>
  );
}
