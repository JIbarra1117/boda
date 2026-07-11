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
    if (data.brideName !== undefined) updateData.brideName = data.brideName;
    if (data.groomName !== undefined) updateData.groomName = data.groomName;
    if (data.polaroidBrideImage !== undefined) updateData.polaroidBrideImage = data.polaroidBrideImage;
    if (data.polaroidGroomImage !== undefined) updateData.polaroidGroomImage = data.polaroidGroomImage;
    if (data.backgroundMusic !== undefined) updateData.backgroundMusic = data.backgroundMusic;

    return this.prisma.settings.update({
      where: { id: settings.id },
      data: updateData,
    });
  }
}
