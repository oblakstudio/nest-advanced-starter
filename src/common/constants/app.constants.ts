import { capitalize } from 'helper-fns';

export const APP_NAME = process.env.APP_NAME ?? 'NestJS App';

export const SWAGGER_TITLE = `${capitalize(APP_NAME)} API Documentation`;

export const SWAGGER_API_ENDPOINT = 'doc';
export const SWAGGER_API_CURRENT_VERSION = '1.9.6';
export const SWAGGER_DESCRIPTION = 'Redis Docker Instance manager';

export const ROUTE_IS_PUBLIC = 'ROUTE:IS_PUBLIC';
