import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { EmailService } from '../email/email.service';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: "asvsdvsdvsdvsdvsvsZsdzfdsf",
            signOptions: { expiresIn: '60m' },
        }),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy, EmailService],
    controllers: [AuthController],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
