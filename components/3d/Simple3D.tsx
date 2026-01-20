import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Simple3DProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export function Simple3D({ children, style }: Simple3DProps) {
  return (
    <View style={[styles.container, style] as any}>
      <View style={styles.cube as any}>
        <View style={[styles.face, styles.front] as any} />
        <View style={[styles.face, styles.back] as any} />
        <View style={[styles.face, styles.left] as any} />
        <View style={[styles.face, styles.right] as any} />
        <View style={[styles.face, styles.top] as any} />
        <View style={[styles.face, styles.bottom] as any} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  cube: {
    width: 60,
    height: 60,
    position: 'relative',
  },
  face: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  front: {
    backgroundColor: '#4F46E5',
  },
  back: {
    backgroundColor: '#7C3AED',
  },
  left: {
    backgroundColor: '#059669',
  },
  right: {
    backgroundColor: '#DC2626',
  },
  top: {
    backgroundColor: '#F59E0B',
  },
  bottom: {
    backgroundColor: '#8B5CF6',
  },
});
