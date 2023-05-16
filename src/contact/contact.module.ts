import { Module } from '@nestjs/common';
import { ContactsService } from './contact.service';
import { ContactsController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Contacts from './entity/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contacts])],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactModule {}
