import { Controller, Get, Post, Body } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      fullName: string;
      email?: string;
      phone?: string;
      maxGuests?: number;
    },
  ) {
    return this.guestsService.create(body);
  }
}
