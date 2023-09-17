import { ConfigModule } from '@lib/config.module';
import { QueueModule } from '@lib/queue.module';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { I18nModule } from '@lib/i18n.module';
import { MinIoModule } from '@lib/minio';
import { ScheduleModule } from '@nestjs/schedule';
import { OrmModule } from '@lib/orm.module';

@Module({
  imports: [
    ConfigModule,
    QueueModule,
    OrmModule,
    ScheduleModule.forRoot(),
    HttpModule,
    I18nModule,
    MinIoModule,
  ],
})
export class SharedModule {}
