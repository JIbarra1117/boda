import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    let settings = await this.prisma.settings.findFirst();

    if (!settings) {
      settings = await this.prisma.settings.create({
        data: {
          weddingDate: new Date('2026-10-22T16:00:00.000Z'),
          weddingTime: '16:00',
          bankAccountNumber: '',
          bankAccountName: '',
          bankName: '',
          brideName: 'Karen Mejía',
          groomName: 'Jorge Ibarra',
        },
      });
    }

    return settings;
  }

  async updateSettings(data: any) {
    const settings = await this.getSettings();

    const updateData: any = {};
    if (data.weddingDate !== undefined) updateData.weddingDate = new Date(data.weddingDate);
    if (data.weddingTime !== undefined) updateData.weddingTime = data.weddingTime;
    if (data.bankAccountNumber !== undefined) updateData.bankAccountNumber = data.bankAccountNumber;
    if (data.bankAccountName !== undefined) updateData.bankAccountName = data.bankAccountName;
    if (data.bankName !== undefined) updateData.bankName = data.bankName;
    if (data.bankAccountId !== undefined) updateData.bankAccountId = data.bankAccountId;
    if (data.bankAccountEmail !== undefined) updateData.bankAccountEmail = data.bankAccountEmail;
    if (data.brideName !== undefined) updateData.brideName = data.brideName;
    if (data.groomName !== undefined) updateData.groomName = data.groomName;
    if (data.polaroidBrideImage !== undefined) updateData.polaroidBrideImage = data.polaroidBrideImage;
    if (data.polaroidGroomImage !== undefined) updateData.polaroidGroomImage = data.polaroidGroomImage;
    if (data.backgroundMusic !== undefined) updateData.backgroundMusic = data.backgroundMusic;

    if (data.ceremonyTime !== undefined) updateData.ceremonyTime = data.ceremonyTime;
    if (data.ceremonyLocation !== undefined) updateData.ceremonyLocation = data.ceremonyLocation;
    if (data.ceremonyAddress !== undefined) updateData.ceremonyAddress = data.ceremonyAddress;
    if (data.ceremonyMapsUrl !== undefined) updateData.ceremonyMapsUrl = data.ceremonyMapsUrl;
    if (data.celebrationTime !== undefined) updateData.celebrationTime = data.celebrationTime;
    if (data.celebrationLocation !== undefined) updateData.celebrationLocation = data.celebrationLocation;
    if (data.celebrationAddress !== undefined) updateData.celebrationAddress = data.celebrationAddress;
    if (data.celebrationMapsUrl !== undefined) updateData.celebrationMapsUrl = data.celebrationMapsUrl;
    if (data.calendarUrl !== undefined) updateData.calendarUrl = data.calendarUrl;

    return this.prisma.settings.update({
      where: { id: settings.id },
      data: updateData,
    });
  }
}
