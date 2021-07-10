import { UserRole } from './../../user/user.roles';
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
          context.getHandler(),
        ]);
        if (!roles) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
        const authorization = request.authorization
        const user = request.user
        console.log(request)

        return roles.some((role) => user.role?.includes(role));
      }
}
