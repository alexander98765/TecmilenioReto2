import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../user/role.enum';

/**
     * Layer to validate if user has correct roles to access to ceratin endpoints
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
     * Validate if users has sufficient permissions to access to certain endpoints.
     *
     * @param context - string, exceution context
     * 
     * @remarks
     * Every time a user tries to execute an endpoint, this method will validate the required roles by the endpoint and 
     * will compare the roles assigned to user.
     * If endpoint does not require special roles to be executed,  the access will be granted.
     *
     * @returns Account created
     */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  
    if (!requiredRoles) {      
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    return requiredRoles.some((perfil) => user?.perfil?.includes(perfil));
  }
}