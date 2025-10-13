import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NoteDto } from './note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}
  getAll(isFavourite?: boolean) {
    return this.prismaService.note.findMany({
      where: { isFavourite: isFavourite },
    });
  }

  create(note: NoteDto) {
    return this.prismaService.note.create({
      data: note,
    });
  }
}
