import {
  INestApplication,
  Logger,
  ValidationPipeOptions,
} from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { HelperService } from './helper.utils';

const logger = new Logger('AppUtils');

export const AppUtils = {
  validationPipeOptions(): ValidationPipeOptions {
    return {
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
      enableDebugMessages: HelperService.isDev(),
      exceptionFactory: i18nValidationErrorFactory,
    };
  },

  gracefulShutdown(app: INestApplication, code: string): void {
    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`Signal received with code ${code} ⚡.`);
    logger.log('❗Closing http server with grace.');
    app.close().then(() => {
      logger.log('✅ Http server closed.');
      process.exit(0);
    });
  },

  killAppWithGrace(app: INestApplication): void {
    process.on('SIGINT', async () => {
      AppUtils.gracefulShutdown(app, 'SIGINT');
    });

    process.on('SIGTERM', async () => {
      AppUtils.gracefulShutdown(app, 'SIGTERM');
    });
  },
};
