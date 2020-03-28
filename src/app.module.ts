import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './server/user/user.module';
import { AuthModule } from './server/auth/auth.module';
import { GrantModule } from './server/grant/grant.module';
import { GrantFundModule } from './server/funding/grantFund.module';
import { SignalModule } from './server/signal/signal.module';
import { PayoutModule } from './server/payout/payout.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/Grants-platform', { useNewUrlParser: true }),
    AuthModule,
    UserModule,
    GrantModule,
    GrantFundModule,
    SignalModule,
    PayoutModule
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'files')
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
