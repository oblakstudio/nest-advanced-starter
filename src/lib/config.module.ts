import { AppConfig } from '@common/config';
import { HelperService } from '@common/helpers';
import { Module } from '@nestjs/common';
import { TypedConfigModule, fileLoader } from 'nest-typed-config';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      schema: AppConfig,
      load: fileLoader({
        cache: HelperService.isProd(),
        ignoreEnvironmentVariableSubstitution: false,
        ...HelperService.getConfigPath(),
      }),
    }),
  ],
  exports: [TypedConfigModule],
})
export class ConfigModule {}
