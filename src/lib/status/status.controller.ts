import { Public } from '@common/decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Status')
@Controller('status')
export class StatusController {
  @Public()
  @Get()
  status() {
    return { status: 'ok' };
  }
}
