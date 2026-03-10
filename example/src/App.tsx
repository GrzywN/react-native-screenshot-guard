import { useScreenshotGuard } from 'react-native-screenshot-guard';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [isProtected, setIsProtected] = useState(true);

  useScreenshotGuard(isProtected);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Text style={styles.header}>expo-screenshot-guard</Text>
          <View style={styles.group}>
            <Text style={styles.groupHeader}>Screenshot Protection</Text>
            <Text>
              Protection is currently:{' '}
              <Text style={styles.bold}>
                {isProtected ? 'ENABLED' : 'DISABLED'}
              </Text>
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => setIsProtected((prev) => !prev)}
            >
              <Text style={styles.buttonText}>
                {isProtected ? 'Disable Protection' : 'Enable Protection'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold' as const,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    gap: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
