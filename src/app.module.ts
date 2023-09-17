import { SharedModule } from '@modules/shared';
import { Module } from '@nestjs/common';

@Module({
  imports: [SharedModule],
})
export class AppModule {}
