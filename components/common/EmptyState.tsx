import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmptyState({ text }: { text: string }) {
  return (
    <View style={{ alignItems: 'center', padding: 20, opacity: 0.7 }}>
      <MaterialIcons name="info-outline" size={40} color="#B0B0B0" />
      <Text style={{ color: '#B0B0B0', marginTop: 10, fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{text}</Text>
    </View>
  );
} 