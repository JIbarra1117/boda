import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SettingsService } from '../settings/settings.service';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

@Controller('upload')
export class UploadController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('media')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'polaroidBrideImage', maxCount: 1 },
        { name: 'polaroidGroomImage', maxCount: 1 },
        { name: 'backgroundMusic', maxCount: 1 },
      ],
      { storage },
    ),
  )
  async uploadMedia(
    @UploadedFiles()
    files: {
      polaroidBrideImage?: Express.Multer.File[];
      polaroidGroomImage?: Express.Multer.File[];
      backgroundMusic?: Express.Multer.File[];
    },
  ) {
    if (
      !files.polaroidBrideImage?.[0] &&
      !files.polaroidGroomImage?.[0] &&
      !files.backgroundMusic?.[0]
    ) {
      throw new BadRequestException('No se enviaron archivos');
    }

    const updateData: any = {};

    if (files.polaroidBrideImage?.[0]) {
      updateData.polaroidBrideImage =
        '/uploads/' + files.polaroidBrideImage[0].filename;
    }
    if (files.polaroidGroomImage?.[0]) {
      updateData.polaroidGroomImage =
        '/uploads/' + files.polaroidGroomImage[0].filename;
    }
    if (files.backgroundMusic?.[0]) {
      updateData.backgroundMusic =
        '/uploads/' + files.backgroundMusic[0].filename;
    }

    const settings = await this.settingsService.updateSettings(updateData);
    return settings;
  }
}
