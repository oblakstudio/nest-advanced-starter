import { I18nTranslations } from '@generated';
import { FileLoaderOptions } from 'nest-typed-config';
import { fileLoader } from 'nest-typed-config';
import { I18nContext, Path, TranslateOptions } from 'nestjs-i18n';
import { AppConfig } from '@common/config';
import * as os from 'node:os';

export const HelperService = {
  isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  },
  isDev(): boolean {
    if (process.env.NODE_ENV === undefined) {
      return true;
    }
    return process.env.NODE_ENV?.startsWith('dev');
  },

  isProd(): boolean {
    return (
      (process.env.NODE_ENV && process.env?.NODE_ENV?.startsWith('prod')) ||
      false
    );
  },

  formatSearch(search: string): string {
    return `%${search
      .trim()
      .replaceAll('\n', ' ')
      .replaceAll(/\s\s+/g, ' ')
      .toLowerCase()}%`;
  },

  getConfigPath(): FileLoaderOptions {
    if (process.env?.WCS_CONFIG_PATH !== undefined) {
      return {
        absolutePath: process.env.WCS_CONFIG_PATH,
      };
    }

    return {
      searchFrom: this.isProd() ? `${os.homedir()}/config` : process.cwd(),
      basename: HelperService.isProd() ? 'base' : 'config',
    };
  },

  getConfig(): AppConfig {
    return fileLoader({ ...this.getConfigPath() })() as AppConfig;
  },

  translate(path: Path<I18nTranslations>, options?: TranslateOptions): string {
    return I18nContext.current<I18nTranslations>().t(path, options);
  },

  msToTime(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const hoursStr = hours < 10 ? `0${hours}` : hours;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    const secondsStr = seconds < 10 ? `0${seconds}` : seconds;

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  },

  splitToChunks<T>(array: T[], chunkSize: number = 100): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }

    return chunks;
  },
};
