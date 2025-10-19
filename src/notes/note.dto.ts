export interface NoteDto {
  title: string;
  content?: string;
  isFavourite: boolean;
  priority: number;
}

export interface PartialNoteDto {
  title?: string;
  content?: string;
  isFavourite?: boolean;
  priority?: number;
}
