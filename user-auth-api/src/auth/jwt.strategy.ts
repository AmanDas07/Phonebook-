import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || "asvsdvsdvsdvsdvsvsZsdzfdsf",
        });
    }

    async validate(payload: JwtPayload) {
        this.logger.log(`Validating payload: ${JSON.stringify(payload)}`);
        const user = { userId: payload.sub, email: payload.email };
        this.logger.log(`Returning user: ${JSON.stringify(user)}`);
        return user;
    }
}

