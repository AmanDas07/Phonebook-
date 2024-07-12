
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "asvsdvsdvsdvsdvsvsZsdzfdsf",
            signOptions: { expiresIn: '1h' },
        }),
        PassportModule,
        forwardRef(() => AuthModule),
    ],
    providers: [UsersService, JwtStrategy],
    controllers: [UserController],
    exports: [UsersService],
})
export class UserModule { }
