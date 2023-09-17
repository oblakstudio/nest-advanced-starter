import { MinIoConfig } from '@common/config';
import { Global, Module } from '@nestjs/common';
import { NestMinioModule } from 'nestjs-minio';
import { MinIoService } from './minio.service';

@Global()
@Module({
  imports: [
    NestMinioModule.registerAsync({
      imports: [MinIoConfig],
      useFactory: (config: MinIoConfig) => config,
      inject: [MinIoConfig],
    }),
  ],
  providers: [MinIoService],
  exports: [MinIoService],
})
export class MinIoModule {}
