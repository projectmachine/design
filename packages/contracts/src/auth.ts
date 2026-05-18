export const USER_ROLES = ['admin', 'user'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  displayName?: string | null;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface AuthStateResponse {
  user: AuthUser | null;
}

export interface AdminUserSummary extends AuthUser {
  lastSignInAt?: string | null;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}

export interface AdminConfigEntry {
  key: string;
  value: string;
  updatedAt: string;
}

export interface AdminConfigResponse {
  entries: AdminConfigEntry[];
}

export interface UpdateAdminConfigRequest {
  entries: AdminConfigEntry[];
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}
