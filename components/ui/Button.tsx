import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  backgroundColor?: string;
  color?: string;
  borderRadius?: number;
  paddingVertical?: number;
  marginBottom?: number;
  borderWidth?: number;
  borderColor?: string;
  [key: string]: any;
}

export function Button({ 
  onPress, 
  loading, 
  disabled, 
  children, 
  style,
  textStyle,
  backgroundColor = '#4F46E5',
  color = 'white',
  borderRadius = 8,
  paddingVertical = 12,
  marginBottom = 0,
  ...props 
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius,
          paddingVertical,
          marginBottom,
          opacity: (disabled || loading) ? 0.7 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text style={[styles.text, { color }, textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
