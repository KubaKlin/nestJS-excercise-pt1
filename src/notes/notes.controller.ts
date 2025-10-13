import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import type { NoteDto } from './note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Get()
  getAll(@Query('isFavourite') isFavourite?: boolean) {
    return this.notesService.getAll(isFavourite);
  }
  @Post()
  create(@Body() note: NoteDto) {
    return this.notesService.create(note);
  }
}
