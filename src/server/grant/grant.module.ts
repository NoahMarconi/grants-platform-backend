import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GrantSchema } from './grant.model';
import { GrantService } from './grant.service';
import { GrantController } from './grant.controller';
import { GrantFundService } from '../funding/grantFund.service';
import { GrantFundSchema } from '../funding/grantFund.model';
import { ImageUploadService } from '../../helpers/imageUpload.Service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grant', schema: GrantSchema }]),
    MongooseModule.forFeature([{ name: 'GrantFund', schema: GrantFundSchema }])
  ],
  controllers: [GrantController],
  providers: [GrantService, GrantFundService, ImageUploadService]
})
export class GrantModule { }