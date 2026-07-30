import { Circle, Line, Path, Svg } from 'react-native-svg';

import type { TabIconProps } from './interfaces/TabIcon.interface';

/** Tab bar icon set, drawn with `react-native-svg` (same approach as `IngredientIcon`, ADR-0004). */
export function TabIcon({ name, size = 24, color = '#000000' }: TabIconProps) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (name === 'menu') {
    return (
      <Svg testID="tab-icon-menu" accessible={false} {...shared}>
        <Line x1={8} y1={6} x2={21} y2={6} />
        <Line x1={8} y1={12} x2={21} y2={12} />
        <Line x1={8} y1={18} x2={21} y2={18} />
        <Line x1={3} y1={6} x2={3.01} y2={6} />
        <Line x1={3} y1={12} x2={3.01} y2={12} />
        <Line x1={3} y1={18} x2={3.01} y2={18} />
      </Svg>
    );
  }

  return (
    <Svg testID="tab-icon-quiz" accessible={false} {...shared}>
      <Circle cx={12} cy={12} r={10} />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Line x1={12} y1={17} x2={12.01} y2={17} />
    </Svg>
  );
}
