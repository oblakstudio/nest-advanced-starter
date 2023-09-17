import { ValidateNested } from 'class-validator';
import { RedisConfig } from './redis.config';
import { QueueConfig } from './queue.config';
import { Type } from 'class-transformer';
import { MinIoConfig } from './minio.config';
import { HttpConfig } from './http.config';
import { DbConfig } from './db.config';

export class AppConfig {
  @ValidateNested()
  @Type(() => HttpConfig)
  http: HttpConfig = new HttpConfig();

  @ValidateNested()
  @Type(() => RedisConfig)
  redis: RedisConfig = new RedisConfig();

  @ValidateNested()
  @Type(() => QueueConfig)
  queue!: QueueConfig;

  @ValidateNested()
  @Type(() => DbConfig)
  db!: DbConfig;

  @Type(() => MinIoConfig)
  @ValidateNested()
  minio!: MinIoConfig;
}
