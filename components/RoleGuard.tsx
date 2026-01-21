import React from 'react';
import { View, Text } from 'react-native';
import { UserRole } from '../constants/types';
import { useAuth } from '../hooks/useAuth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * RoleGuard Component
 * 
 * Conditionally renders children based on the current user's role.
 * Only renders content if the user's role matches one of the allowedRoles.
 * 
 * @param allowedRoles - Array of roles that are allowed to view the content
 * @param children - Content to display if user role is allowed
 * @param fallback - Content to display if user role is not allowed (optional)
 * 
 * @example
 * <RoleGuard allowedRoles={['admin', 'club_lead']}>
 *   <ManageClubButton />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  const hasAccess = allowedRoles.includes(user.role);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
