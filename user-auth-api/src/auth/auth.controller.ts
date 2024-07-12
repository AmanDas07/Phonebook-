import { Controller, Post, Body, Get, Query, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: any) {
        return this.authService.register(body);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() loginDto: { email: string, password: string }) {


        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {

            throw new UnauthorizedException();
        }

        return this.authService.login(user);
    }
}
