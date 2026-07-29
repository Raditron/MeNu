import { View } from 'react-native';

import { useAppTheme } from '@/theme';

export default function QuizScreen() {
  const theme = useAppTheme();
  return <View style={{ flex: 1, backgroundColor: theme.canvas }} />;
}
