import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findByEmail(payload.email);

            if (user) {
                request.user = { userId: user.id, email: user.email };
                return true;
            } else {
                throw new UnauthorizedException('Invalid token');
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request): string | null {
        const [type, token] = (request.headers.authorization || '').split(' ');
        return type === 'Bearer' ? token : null;
    }
}
