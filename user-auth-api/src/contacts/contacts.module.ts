import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contacts.entity';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact]),
        AuthModule,
        UserModule,
    ],
    providers: [ContactsService],
    controllers: [ContactsController],
})
export class ContactsModule { }
