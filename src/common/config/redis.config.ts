import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RedisConfig {
  @IsString()
  host = 'redis';

  @IsNumber()
  @Min(1024)
  @Max(65535)
  port = 6379;

  @IsString()
  @IsOptional()
  username = 'redis';

  @IsString()
  @IsOptional()
  password = 'redis';
}
