import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsModule } from './settings/settings.module';
import { GuestsModule } from './guests/guests.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [PrismaModule, SettingsModule, GuestsModule, RsvpModule, UploadModule],
})
export class AppModule {}
