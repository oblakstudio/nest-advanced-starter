import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class MinIoConfig {
  @IsString()
  @IsNotEmpty()
  endPoint: string;

  @IsNumber()
  @Min(1)
  port: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  accessKey: string;

  @IsString()
  @IsNotEmpty()
  secretKey: string;

  @IsBoolean()
  useSSL?: boolean;

  @IsString()
  @IsNotEmpty()
  region: string = 'hetzner-falkenstein';

  @IsString()
  @IsNotEmpty()
  policy: string = 'readonly';
}
