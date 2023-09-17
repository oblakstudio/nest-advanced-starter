import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { AppModule } from 'app.module';
import compression from 'compression';
import { AppUtils, HelperService } from '@common/helpers';
import { I18nValidationExceptionFilter } from 'nestjs-i18n';
import { useContainer } from 'class-validator';
import chalk from 'chalk';
import { setupSwagger } from '@common/helpers/swagger.plugin';
import { HttpConfig } from '@common/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      snapshot: true,
    },
  );

  const httpConfig = app.get(HttpConfig);
  const logger = new Logger('Bootstrap');

  app.set('etag', 'strong');
  app.use(
    bodyParser.json({ limit: '50mb' }),
    bodyParser.urlencoded({ limit: '50mb', extended: true }),
  );
  app.use(helmet());

  if (HelperService.isProd()) {
    app.use(compression({}));
    if (httpConfig.corsOrigin !== '') {
      app.enableCors({
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        maxAge: 3600,
        origin: httpConfig.corsOrigin.split(','),
      });
    }
  }

  app.useGlobalPipes(new ValidationPipe(AppUtils.validationPipeOptions()));

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );

  app.setGlobalPrefix(httpConfig.prefix);

  if (!HelperService.isProd() && !HelperService.isTest()) {
    setupSwagger(app);
  }

  app.enableShutdownHooks();

  AppUtils.killAppWithGrace(app);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port = httpConfig.port;
  const host = httpConfig.host;

  await app.listen(port, host);

  logger.log(
    `🚀 Application is running on: ${chalk.green(
      `http://${host}:${port}/${httpConfig.prefix}`,
    )}`,
  );

  !HelperService.isProd() &&
    logger.log(
      `📑 Swagger is running on: ${chalk.green(`http://${host}:${port}/doc`)}`,
    );
  logger.log(
    `Server is up. ${chalk.yellow(`+${Math.trunc(performance.now())}ms`)}`,
  );
}
(async () => await bootstrap())();
