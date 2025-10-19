import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  ParseBoolPipe,
  Delete,
  Patch,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import type { NoteDto, PartialNoteDto } from './note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAll(
    @Query('isFavourite', new ParseBoolPipe({ optional: true }))
    isFavourite?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.notesService.getAll(isFavourite, sortBy, order);
  }
  @Post()
  create(@Body() note: NoteDto) {
    return this.notesService.create(note);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.notesService.delete(id);
  }

  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @Body() note: NoteDto) {
    return this.notesService.replace(id, note);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() partialNote: PartialNoteDto,
  ) {
    return this.notesService.update(id, partialNote);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.duplicate(id);
  }
}
