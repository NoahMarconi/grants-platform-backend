import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller'
import { GrantService } from '../grant/grant.service';
import { GrantSchema } from '../grant/grant.model';
import { PayoutSchema } from './Payout.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Payout', schema: PayoutSchema }]),
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }])
  ],
  controllers: [PayoutController],
  providers: [PayoutService,GrantService]
})
export class PayoutModule { }