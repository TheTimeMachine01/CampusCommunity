import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function IndexScreen() {
  const { isLoadingAuth } = useAuth();

  // Show loading while auth state is being determined
  // AuthContext will handle navigation once loading is complete
  if (isLoadingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  // AuthContext handles navigation, so this component doesn't need to render anything
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
