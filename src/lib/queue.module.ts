import { QueueConfig, RedisConfig } from '@common/config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (redis: RedisConfig, queue: QueueConfig) => ({
        redis,
        ...queue,
      }),
      inject: [RedisConfig, QueueConfig],
    }),
  ],
})
export class QueueModule {}
