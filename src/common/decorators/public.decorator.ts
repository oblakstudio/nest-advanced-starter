import { ROUTE_IS_PUBLIC } from '@common/constants';
import { SetMetadata } from '@nestjs/common';
export const Public = () => SetMetadata(ROUTE_IS_PUBLIC, true);
