import { ormBaseOptions } from '@common/database';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { defineConfig } from '@mikro-orm/mysql';
import { MikroORM } from '@mikro-orm/core';
import { DbConfig } from '@common/config';
import * as entities from '@entities';
import { HelperService } from '@common/helpers';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [DbConfig],
      useFactory: (dbConfig: DbConfig) =>
        defineConfig({
          ...ormBaseOptions,
          dbName: dbConfig.database,
          user: dbConfig.username,
          password: dbConfig.password,
          host: dbConfig.host,
          port: dbConfig.port,
        }),
      inject: [DbConfig],
    }),
    MikroOrmModule.forFeature({
      entities: Object.values(entities),
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule implements OnApplicationBootstrap {
  constructor(private readonly orm: MikroORM) {}

  async onApplicationBootstrap() {
    HelperService.isProd() && (await this.orm.getMigrator().up());
  }
}
