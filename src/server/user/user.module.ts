import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserController } from './user.controller'
import { UserService } from './user.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }