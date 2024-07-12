import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contacts.entity';

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(Contact)
        private contactsRepository: Repository<Contact>,
    ) { }

    async create(contactData: Partial<Contact>, userId: number): Promise<Contact> {
        const contact = this.contactsRepository.create({
            ...contactData,
            user: { id: userId },
        });
        return this.contactsRepository.save(contact);
    }

    async findAll(userId: number, page = 1, limit = 10): Promise<{ contacts: Contact[], total: number }> {
        const [contacts, total] = await this.contactsRepository.findAndCount({
            where: { user: { id: userId } },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { contacts, total };
    }

    async search(userId: number, query: string): Promise<Contact[]> {
        return this.contactsRepository
            .createQueryBuilder('contact')
            .where('contact.user.id = :userId', { userId })
            .andWhere('contact.name LIKE :query OR contact.phoneNumber LIKE :query', { query: `%${query}%` })
            .getMany();
    }
}
