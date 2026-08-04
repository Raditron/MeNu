import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  mealName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
  },
});
