import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: {
    fullName: string;
    email?: string;
    phone?: string;
    maxGuests?: number;
  }) {
    return this.prisma.guest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        maxGuests: data.maxGuests ?? 1,
      },
    });
  }
}
