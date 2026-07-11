import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [UploadController],
})
export class UploadModule {}
