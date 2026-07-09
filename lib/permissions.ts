import type { UserRole } from "@prisma/client";

const ROLE_LEVEL: Record<UserRole, number> = {
  EDITOR: 1,
  ADMIN: 2,
  SUPERADMIN: 3,
};

export function hasRole(userRole: UserRole, required: UserRole): boolean {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[required];
}
