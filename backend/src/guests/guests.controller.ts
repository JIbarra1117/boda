import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @Get('by-token/:token')
  findByToken(@Param('token') token: string) {
    return this.guestsService.findByToken(token);
  }

  @Post()
  create(
    @Body()
    body: {
      fullName: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.guestsService.create(body);
  }

  @Post('bulk')
  createBulk(
    @Body()
    body: {
      guests: Array<{
        fullName: string;
        email?: string;
        phone?: string;
      }>;
    },
  ) {
    return this.guestsService.createBulk(body.guests);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      fullName?: string;
      email?: string;
      phone?: string;
    },
  ) {
    return this.guestsService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(Number(id));
  }
}
