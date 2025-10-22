import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NotesService } from './notes/notes.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notesService: NotesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('notes-stats')
  getNotesStats() {
    return this.notesService.getStats();
  }
}
