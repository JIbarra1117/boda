import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

@Injectable()
export class GuestsService {
  constructor(private prisma: PrismaService) {}

  private generateCode(length = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
    }
    return code;
  }

  private async generateUniqueCode(): Promise<string> {
    let attempts = 0;
    while (attempts < 20) {
      const code = this.generateCode();
      const existing = await this.prisma.guest.findUnique({ where: { code } });
      if (!existing) return code;
      attempts++;
    }
    throw new Error('No se pudo generar un código único para el invitado');
  }

  findAll() {
    return this.prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
      include: { rsvp: true },
    });
  }

  findByToken(token: string) {
    return this.prisma.guest.findFirst({
      where: {
        OR: [{ token }, { code: token }],
      },
    });
  }

  async create(data: {
    fullName: string;
    email?: string;
    phone?: string;
    maxGuests?: number;
  }) {
    const code = await this.generateUniqueCode();

    return this.prisma.guest.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        maxGuests: data.maxGuests ?? 1,
        code,
      },
    });
  }

  async createBulk(
    guests: Array<{
      fullName: string;
      email?: string;
      phone?: string;
      maxGuests?: number;
    }>,
  ) {
    const results = [];
    const errors = [];

    for (const [index, data] of guests.entries()) {
      try {
        if (!data.fullName?.trim()) {
          throw new Error('Nombre vacío');
        }
        const guest = await this.create(data);
        results.push(guest);
      } catch (e: any) {
        errors.push({ row: index + 1, fullName: data.fullName, error: e.message });
      }
    }

    return { created: results.length, errors, guests: results };
  }

  async update(
    id: number,
    data: {
      fullName?: string;
      email?: string;
      phone?: string;
      maxGuests?: number;
    },
  ) {
    const guest = await this.prisma.guest.findUnique({ where: { id } });
    if (!guest) throw new NotFoundException('Invitado no encontrado');

    return this.prisma.guest.update({
      where: { id },
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        maxGuests: data.maxGuests,
      },
    });
  }

  async remove(id: number) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
      include: { rsvp: true },
    });
    if (!guest) throw new NotFoundException('Invitado no encontrado');

    if (guest.rsvp) {
      await this.prisma.rsvp.delete({ where: { id: guest.rsvp.id } });
    }

    return this.prisma.guest.delete({ where: { id } });
  }
}
