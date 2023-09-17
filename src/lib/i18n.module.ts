import path from 'node:path';
import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule as NestI18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { HelperService } from '@common/helpers';

@Module({
  imports: [
    NestI18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'sr-*': 'sr',
        'en-*': 'en',
        'sr_*': 'sr',
        'en_*': 'en',
        en: 'en',
        sr: 'sr',
      },
      logging: true,
      loaderOptions: {
        path: path.join(__dirname, '../resources/i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      typesOutputPath: path.join(
        process.cwd() +
          `/${
            HelperService.isProd() ? 'dist' : 'src'
          }/generated/i18n.generated.ts`,
      ),
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(),
        new QueryResolver(['lang', 'locale']),
        AcceptLanguageResolver,
      ],
    }),
  ],
  exports: [NestI18nModule],
})
export class I18nModule {}
