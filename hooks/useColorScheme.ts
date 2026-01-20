import { useColorScheme as useColorSchemeRN } from 'react-native';
import { useResolvedColorScheme } from '../context/ThemeContext';

export function useColorScheme() {
  const resolved = useResolvedColorScheme();
  return resolved || useColorSchemeRN();
}
