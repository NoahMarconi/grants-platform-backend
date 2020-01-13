import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantSchema } from './grant.model';
import { GrantService } from './grant.service';
import { GrantController } from './grant.controller';
import { GrantFundService } from '../funding/grantFund.service';
import { GrantFundSchema } from '../funding/grantFund.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }])
  ],
  controllers: [GrantController],
  providers: [GrantService, GrantFundService]
})
export class GrantModule { }