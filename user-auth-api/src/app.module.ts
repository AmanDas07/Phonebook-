import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ContactsModule } from './contacts/contacts.module';
import { User } from './user/user.entity';
import { Contact } from './contacts/contacts.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { UsersService } from './user/user.service';
import { ContactsService } from './contacts/contacts.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'AMANDAS',
      database: process.env.DATABASE_NAME || 'UserAuth',
      entities: [User, Contact],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Contact]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "asvsdvsdvsdvsdvsvsZsdzfdsf",
      signOptions: { expiresIn: '60m' },
    }),
    AuthModule,
    UserModule,
    ContactsModule,
  ],
  providers: [AuthService, UsersService, ContactsService, JwtStrategy, EmailService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    this.logger.log('Application has started.');
    this.logger.log('Checking database connection...');
    try {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'AMANDAS',
        database: process.env.DATABASE_NAME || 'UserAuth',
        entities: [User, Contact],
        synchronize: true,
      });

      await dataSource.initialize();

      if (dataSource.isInitialized) {
        this.logger.log('Database connection is established.');
      } else {
        this.logger.error('Failed to connect to the database.');
      }
    } catch (error) {
      this.logger.error('Database connection error:', error.message);
    }
  }
}
