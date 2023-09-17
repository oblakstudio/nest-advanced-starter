import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class DbConfig {
  @IsString()
  host = 'localhost';

  @IsNumber()
  @Min(1024)
  port = 3306;

  @IsString()
  database: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(2)
  password: string;
}
