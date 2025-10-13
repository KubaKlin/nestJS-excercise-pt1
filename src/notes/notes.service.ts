import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NoteDto } from './note.dto';
import { Prisma } from '../../generated/prisma';
import { PrismaError } from '../database/prisma-error.enum';

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

  async getById(id: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id,
      },
    });
    if (!note) {
      throw new NotFoundException();
    }
    return note;
  }

  async delete(id: number) {
    try {
      return await this.prismaService.note.delete({
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async update(id: number, note: NoteDto) {
    try {
      return await this.prismaService.note.update({
        data: {
          ...note,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
