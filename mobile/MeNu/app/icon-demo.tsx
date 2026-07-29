import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IngredientIcon } from '@/meal/components/IngredientIcon/IngredientIcon';
import { useAppTheme } from '@/theme';

/**
 * Standalone demo of `IngredientIcon` (#28) — lets it be exercised without
 * the Menu/Quiz screens that will eventually render it existing yet.
 * Not linked from the tab shell; reachable directly at `/icon-demo`.
 */
const SAMPLE_KEYS = [
  'GiPig',
  'GiCow',
  'GiChicken',
  'GiShrimp',
  'GiSalmon',
  'GiBowlOfRice',
  'GiPotato',
  'GiBread',
  'GiUnknownIcon',
];

export default function IconDemoScreen() {
  const theme = useAppTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.canvas }]}>
      <View style={styles.grid}>
        {SAMPLE_KEYS.map((key) => (
          <View key={key} style={[styles.cell, { backgroundColor: theme.tagBg, borderRadius: theme.radiusCard }]}>
            <IngredientIcon iconKey={key} size={48} color={theme.textH} />
            <Text style={[styles.label, { color: theme.text }]}>{key}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 16,
  },
  cell: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
  },
});
