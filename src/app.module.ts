import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForexAlert } from './entity/forexalert.entity';
import { ForexAlertController } from './controller/forexalert.controller';
import { ForexAlertService } from './service/forexalert.service';
import { hanaDataSource } from './database/DataSource.database';
import { DatabaseService } from './database/database.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './service/email.service';
import { NotFoundExceptionFilter } from './filters/notfound.exception';
import { EndpointService } from './service/endpoint.service';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ForexSseController } from './controller/forex-sse.controller';
import { TestController } from './controller/test.controller';

@Module({
    imports: [
      ScheduleModule.forRoot(),
      ConfigModule.forRoot(),
      EventEmitterModule.forRoot()
        ],
  controllers: [AppController,ForexAlertController,ForexSseController,TestController],
 // providers: [AppService,ForexAlertService,DatabaseService,SapAlertNotificationService,EmailService,NotFoundExceptionFilter],
  providers: [
    AppService,
    ForexAlertService,
    DatabaseService,
    EmailService,
    EndpointService, // Register EndpointService
    NotFoundExceptionFilter
  ],
})
export class AppModule {}
