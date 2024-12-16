import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Autorizacion del header perdido');
    }

    const [authType, authValue] = authorizationHeader.split(' ');

    if (authType !== 'Bearer' || !authValue) {
      throw new UnauthorizedException('Autorizacion invalida');
    }

    try {
      const decoded = this.jwtService.verify(authValue, {
        secret: process.env.JWT_SECRET,
      });
      if (!decoded.roles.includes('admin')) {
        throw new ForbiddenException('Acceso denegado: rol insuficiente');
      }
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalido o token expirado');
    }
  }
}
