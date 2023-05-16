import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import Users from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
