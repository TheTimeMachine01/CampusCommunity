import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export function CampusModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Main Building */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 3, 1]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
      
      {/* Left Wing */}
      <mesh position={[-1.5, 0, 0]}>
        <boxGeometry args={[1, 2, 0.8]} />
        <meshStandardMaterial color="#7C3AED" />
      </mesh>
      
      {/* Right Wing */}
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[1, 2, 0.8]} />
        <meshStandardMaterial color="#059669" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 2, 0]}>
        <coneGeometry args={[1.5, 0.5, 4]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      
      {/* Ground */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#10B981" />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[0, 3, 0]} intensity={0.3} />
    </group>
  );
}
