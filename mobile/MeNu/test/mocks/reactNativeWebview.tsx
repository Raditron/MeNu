import { View } from 'react-native';
import type { ComponentProps } from 'react';

export function WebView(props: ComponentProps<typeof View> & { source?: { uri: string } }) {
  return <View {...props} />;
}
