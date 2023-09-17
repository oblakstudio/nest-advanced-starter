import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class QueueConfig {
  @IsString()
  @IsNotEmpty()
  prefix: string = 'cdn';

  @ValidateNested()
  @Type(() => JobDefaultOpts)
  defaultJobOptions = new JobDefaultOpts();

  @ValidateNested()
  @Type(() => QueueSettings)
  settings = new QueueSettings();

  @IsNumber()
  @Min(10)
  delay: number = 200;
}

export class BackoffOpts {
  @IsEnum(['fixed', 'exponential'])
  type: 'fixed' | 'exponential' = 'fixed';

  @IsPositive()
  delay: number = 2000;
}

class JobDefaultOpts {
  @IsNumber()
  @Min(1)
  @Max(10)
  attempts = 5;

  @IsNumber()
  @Min(1000)
  @Max(600000)
  timeout = 300 * 1000;

  @IsBoolean()
  removeOnComplete = true;

  @ValidateNested()
  @Type(() => BackoffOpts)
  backoff: BackoffOpts = new BackoffOpts();
}

class QueueSettings {
  @IsNumber()
  @Min(10000)
  @Max(600000)
  lockDuration = 300 * 1000 + 1000;

  @IsNumber()
  @Min(1)
  @Max(10)
  maxStalledCount = 1;

  @IsNumber()
  @Min(10000)
  @Max(600000)
  lockRenewTime = 30 * 1000;

  @IsNumber()
  @Min(1000)
  @Max(60000)
  stalledInterval = 30 * 1000;
}
