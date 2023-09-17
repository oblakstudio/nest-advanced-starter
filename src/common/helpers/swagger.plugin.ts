import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_ENDPOINT,
  SWAGGER_DESCRIPTION,
  SWAGGER_TITLE,
} from '@common/constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getMiddleware } from 'swagger-stats';
import { HelperService } from './helper.utils';
import { INestApplication } from '@nestjs/common';

export const CaseInsensitiveFilterPlugin = () => {
  return {
    fn: {
      opsFilter: (
        taggedOps: {
          filter: (argument: (_tagObject: any, tag: string) => boolean) => any;
        },
        phrase: string,
      ) => {
        return taggedOps.filter((_tagObject: any, tag: string) =>
          tag.toLowerCase().includes(phrase.toLowerCase()),
        );
      },
    },
  };
};

declare type SortArg = { get: (argument: string) => string };

function operationsSorter(a: SortArg, b: SortArg) {
  const methodsOrder = [
    'get',
    'post',
    'put',
    'patch',
    'delete',
    'options',
    'trace',
  ];
  let result =
    methodsOrder.indexOf(a.get('method')) -
    methodsOrder.indexOf(b.get('method'));

  if (result === 0) {
    result = a.get('path').localeCompare(b.get('path'));
  }

  return result;
}

const swaggerOptions = {
  docExpansion: 'list',
  filter: true,
  showRequestDuration: true,
  persistAuthorization: true,
  plugins: [CaseInsensitiveFilterPlugin],
  operationsSorter,
};

export function setupSwagger(app: INestApplication): void {
  const appUser = process.env.WCS_SWAGGER_USER ?? 'swagger';
  const appPass = process.env.WCS_SWAGGER_PASS ?? 'swagger';
  const appName = process.env.WCS_APP_NAME ?? 'WooCommerce Sync Service';

  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addApiKey(
      {
        name: 'apiKey',
        in: 'header',
        type: 'apiKey',
      },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options, {});

  if (!HelperService.isProd() || !HelperService.isTest()) {
    app.use(
      getMiddleware({
        swaggerSpec: document,
        authentication: true,
        hostname: appName,
        uriPath: '/stats',
        onAuthenticate: (_request: any, username: string, password: string) => {
          return username === appUser && password === appPass;
        },
      }),
    );
  }

  SwaggerModule.setup(SWAGGER_API_ENDPOINT, app, document, {
    explorer: true,
    swaggerOptions,
  });
}
