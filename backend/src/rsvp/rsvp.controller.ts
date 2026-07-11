import { Controller, Get, Post, Body } from '@nestjs/common';
import { RsvpService } from './rsvp.service';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Get()
  findAll() {
    return this.rsvpService.getRsvps();
  }

  @Post()
  create(@Body() body: any) {
    return this.rsvpService.createRsvp(body);
  }
}
