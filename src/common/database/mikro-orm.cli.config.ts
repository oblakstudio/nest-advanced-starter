import * as os from 'os';
import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import { Options, defineConfig } from '@mikro-orm/mysql';
import { AppConfig } from '@common/config';
import { ormBaseOptions } from './mikro-orm.nest.config';

const yamlFilename =
  process.env.NODE_ENV === 'production'
    ? process.env?.CONFIG_PATH
      ? process.env.CONFIG_PATH
      : `${os.homedir()}/config/app.yml`
    : `${process.cwd()}/config.yml`;

const appConfig = yaml.load(
  fs.readFileSync(yamlFilename, 'utf8'),
) as unknown as AppConfig;

const config: Options = defineConfig({
  ...ormBaseOptions,
  dbName: appConfig.db.database,
  user: appConfig.db.username,
  password: appConfig.db.password,
  host: appConfig.db.host,
  port: appConfig.db.port,
});

export default config;
