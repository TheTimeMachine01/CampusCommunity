import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';

interface Scene3DProps {
  children: React.ReactNode;
  style?: any;
}

export function Scene3D({ children, style }: Scene3DProps) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ flex: 1, minHeight: 200 }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </View>
  );
}
