import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        username: user.username,
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, username } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User();
    newUser.email = email;
    newUser.password = hashedPassword;
    newUser.username = username;
    newUser.isEmailVerified = false;

    await this.usersService.create(newUser);

    const verificationToken = this.jwtService.sign(
      { email: newUser.email, sub: newUser.id },
      { expiresIn: '1h' }
    );

    const verificationLink = `http://localhost:3001/auth/verify-email?token=${verificationToken}`;
    await this.emailService.sendEmail(
      newUser.email,
      'Email Verification',
      `Please click the following link to verify your email: ${verificationLink}`
    );

    return {
      message: 'Registration successful! Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new Error('User not found');
      }

      user.isEmailVerified = true;
      await this.usersService.save(user);
      return { message: 'Email verified successfully!' };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
