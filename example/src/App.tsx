import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { useScreenshotGuard } from 'react-native-screenshot-guard';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function ProtectedScreen() {
  const isFocused = useIsFocused();
  useScreenshotGuard(isFocused);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>react-native-screenshot-guard</Text>
        <View style={[styles.group, styles.protectedGroup]}>
          <Text style={styles.groupHeader}>Protected Screen</Text>
          <Text>
            Protection is currently:{' '}
            <Text style={[styles.bold, styles.enabledText]}>ENABLED</Text>
          </Text>
          <Text style={styles.hint}>
            Screenshots and screen recordings should be blocked on this tab.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UnprotectedScreen() {
  useScreenshotGuard(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>expo-screenshot-guard</Text>
        <View style={[styles.group, styles.unprotectedGroup]}>
          <Text style={styles.groupHeader}>Unprotected Screen</Text>
          <Text>
            Protection is currently:{' '}
            <Text style={[styles.bold, styles.disabledText]}>DISABLED</Text>
          </Text>
          <Text style={styles.hint}>
            Screenshots and screen recordings are allowed on this tab.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleScreen() {
  const isFocused = useIsFocused();
  const [isProtected, setIsProtected] = useState(false);
  useScreenshotGuard(isFocused && isProtected);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>expo-screenshot-guard</Text>
        <View style={styles.group}>
          <Text style={styles.groupHeader}>Toggle Screen</Text>
          <Text>
            Protection is currently:{' '}
            <Text
              style={[
                styles.bold,
                isProtected ? styles.enabledText : styles.disabledText,
              ]}
            >
              {isProtected ? 'ENABLED' : 'DISABLED'}
            </Text>
          </Text>
          <Pressable
            style={[
              styles.button,
              isProtected ? styles.buttonDisable : styles.buttonEnable,
            ]}
            onPress={() => setIsProtected((prev) => !prev)}
          >
            <Text style={styles.buttonText}>
              {isProtected ? 'Disable Protection' : 'Enable Protection'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Protected" component={ProtectedScreen} />
          <Tab.Screen name="Unprotected" component={UnprotectedScreen} />
          <Tab.Screen name="Toggle" component={ToggleScreen} />
        </Tab.Navigator>
      </NavigationContainer>
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
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold' as const,
  },
  enabledText: {
    color: '#34C759',
  },
  disabledText: {
    color: '#FF3B30',
  },
  hint: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    gap: 16,
  },
  protectedGroup: {
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  unprotectedGroup: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center' as const,
  },
  buttonEnable: {
    backgroundColor: '#34C759',
  },
  buttonDisable: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};
