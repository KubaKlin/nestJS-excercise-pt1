import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NoteDto, PartialNoteDto } from './note.dto';
import { Prisma } from '../../generated/prisma';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class NotesService {
  constructor(private readonly prismaService: PrismaService) {}

  private buildOrderBy(
    sortBy?: string,
    order?: 'asc' | 'desc',
  ): Prisma.NoteOrderByWithRelationInput | undefined {
    if (!sortBy) {
      return undefined;
    }
    const sortOrder = order || 'asc';
    return { [sortBy]: sortOrder } as Prisma.NoteOrderByWithRelationInput;
  }

  getAll(isFavourite?: boolean, sortBy?: string, order?: 'asc' | 'desc') {
    return this.prismaService.note.findMany({
      where: { isFavourite: isFavourite },
      orderBy: this.buildOrderBy(sortBy, order),
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

  async update(id: number, partialNote: PartialNoteDto) {
    try {
      const updateData = Object.fromEntries(
        Object.entries(partialNote).filter(
          ([key, value]) => value !== undefined,
        ),
      );

      return await this.prismaService.note.update({
        data: {
          ...updateData,
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

  async replace(id: number, note: NoteDto) {
    try {
      return await this.prismaService.note.update({
        data: {
          title: note.title,
          content: note.content ?? null,
          isFavourite: note.isFavourite,
          priority: note.priority,
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

  async duplicate(id: number) {
    const originalNote = await this.getById(id);
    const { id: originalId, ...noteData } = originalNote;
    return this.prismaService.note.create({
      data: noteData,
    });
  }

  async getStats() {
    const [totalNotes, favouritedNotes, notesWithoutContent, averageResult] =
      await Promise.all([
        this.prismaService.note.count(),
        this.prismaService.note.count({
          where: { isFavourite: true },
        }),
        this.prismaService.note.count({
          where: {
            OR: [{ content: null }, { content: '' }],
          },
        }),
        this.prismaService.$queryRaw<[{ averageTitleLength: number }]>`
          SELECT AVG(LENGTH(title)) as averageTitleLength FROM Note
        `,
      ]);

    const averageTitleLength = averageResult[0]?.averageTitleLength || 0;

    return {
      totalNotes,
      favouritedNotes,
      notesWithoutContent,
      averageTitleLength: Math.round(averageTitleLength * 100) / 100,
    };
  }
}
