import { UserService } from './../../user/user.service';
import { UserModel } from './../../user/user.model';
import { UserRole } from './../../user/user.roles';
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly userService: UserService
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
          context.getHandler(),
        ]);
        if (!roles) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
        // const user = this.jwtService.verify(request.authorization.slice(7))
        const userId = request.user;
        console.log(userId)

        return roles.some((role) => user.role?.includes(role));
      }
}
