import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import type { NoteDto } from './note.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  getAll(
    @Query('isFavourite') isFavouriteParam?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    // Convert string parameter to boolean
    let isFavourite: boolean | undefined;
    if (isFavouriteParam !== undefined) {
      isFavourite = isFavouriteParam === 'true';
    }

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

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() note: NoteDto) {
    return this.notesService.update(id, note);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.duplicate(id);
  }
}
