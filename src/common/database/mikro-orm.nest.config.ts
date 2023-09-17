import { HelperService } from '@common/helpers';
import { LoadStrategy, Options } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger, NotFoundException } from '@nestjs/common';

const logger = new Logger('MikroORM');

const ormBaseOptions: Options<MySqlDriver> = {
  entities: ['dist/entities/*.entity.js'],
  entitiesTs: ['src/entities/*.entity.ts'],
  findOneOrFailHandler: (entityName: string, key: unknown) =>
    new NotFoundException(`Entity ${entityName} with key ${key} not found`),
  migrations: {
    fileName: (timestamp: string, name?: string) => {
      return name ? `Migration_${timestamp}_${name}` : `Migration_${timestamp}`;
    },
    tableName: 'migrations',
    path: './dist/migrations',
    pathTs: './src/migrations',
    glob: '!(*.d).{ts,js}',
    transactional: false,
    allOrNothing: true,
    snapshot: true,
  },
  seeder: {
    path: 'dist/common/database/seeders',
    pathTs: 'src/common/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{ts,js}',
  },
  logger: logger[!HelperService.isProd() ? 'debug' : 'log'].bind(logger),
  metadataProvider: TsMorphMetadataProvider,
  highlighter: new SqlHighlighter(),
  debug: !HelperService.isProd(),
  loadStrategy: LoadStrategy.JOINED,
  forceUtcTimezone: true,
  allowGlobalContext: true,
  pool: { min: 2, max: 10 },
};

if (HelperService.isProd()) {
  ormBaseOptions.entitiesTs = undefined;
  ormBaseOptions.migrations.pathTs = undefined;
  ormBaseOptions.seeder.pathTs = undefined;
  ormBaseOptions.metadataProvider = undefined;
}

export { ormBaseOptions };
