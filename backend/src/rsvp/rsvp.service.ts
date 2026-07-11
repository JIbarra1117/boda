import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RsvpService {
  constructor(private prisma: PrismaService) {}

  async createRsvp(data: {
    guestToken: string;
    attendCeremony: boolean;
    attendCelebration: boolean;
    numberOfGuests: number;
    musicSuggestion?: string;
    message?: string;
  }) {
    const guest = await this.prisma.guest.findUnique({
      where: { token: data.guestToken },
      include: { rsvp: true },
    });

    if (!guest) {
      throw new BadRequestException('Invitado no encontrado');
    }

    if (guest.hasRsvp && guest.rsvp) {
      throw new BadRequestException('Este invitado ya confirmó asistencia');
    }

    if (data.numberOfGuests > guest.maxGuests) {
      throw new BadRequestException(
        `Número máximo de invitados permitido: ${guest.maxGuests}`,
      );
    }

    const rsvp = await this.prisma.rsvp.create({
      data: {
        guestId: guest.id,
        attendCeremony: data.attendCeremony,
        attendCelebration: data.attendCelebration,
        numberOfGuests: data.numberOfGuests,
        musicSuggestion: data.musicSuggestion,
        message: data.message,
      },
    });

    await this.prisma.guest.update({
      where: { id: guest.id },
      data: { hasRsvp: true },
    });

    return rsvp;
  }

  async getRsvps() {
    return this.prisma.rsvp.findMany({
      include: { guest: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
