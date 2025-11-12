export const usePermissions = () => {
  const authStore = useAuthStore()

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!authStore.user) return false
    
    // Admin has all permissions
    if (authStore.user.roles?.some((role: any) => role.name === 'admin')) {
      return true
    }

    // Check if user has the permission directly
    if (authStore.user.permissions?.some((p: any) => p.name === permission)) {
      return true
    }

    // Check if any of user's roles have the permission
    return authStore.user.roles?.some((role: any) => 
      role.permissions?.some((p: any) => p.name === permission)
    ) || false
  }

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    if (!authStore.user) return false
    return authStore.user.roles?.some((r: any) => r.name === role) || false
  }

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => hasRole(role))
  }

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole('admin')
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin
  }
}
