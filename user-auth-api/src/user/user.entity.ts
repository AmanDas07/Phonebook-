import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany, Unique } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Contact } from 'src/contacts/contacts.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column()
  username: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
