import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class HttpConfig {
  @IsString()
  prefix: string = 'v1';

  @IsString()
  appName: string = '';

  @IsString()
  @IsNotEmpty()
  host = '0.0.0.0';

  @IsInt()
  @Min(1025)
  port = 5000;

  @IsString()
  swaggerUser = 'app';

  @IsString()
  swaggerPass = 'app';

  @IsString()
  apiKey = 'apikey';

  @IsString()
  corsOrigin: string = '';
}
