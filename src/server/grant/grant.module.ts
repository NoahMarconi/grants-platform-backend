import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantSchema } from './grant.model';
import { GrantService } from './grant.service';
import { GrantController } from './grant.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }])
  ],
  controllers: [GrantController],
  providers: [GrantService]
})
export class GrantModule { }