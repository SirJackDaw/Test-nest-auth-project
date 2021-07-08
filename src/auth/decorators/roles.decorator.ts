import { UserRole } from './../../user/user.roles';
import { SetMetadata } from "@nestjs/common";

export const hasRoles = (...hasRoles: UserRole[]) => SetMetadata('roles', hasRoles)
