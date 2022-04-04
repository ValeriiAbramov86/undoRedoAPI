import { IParagraph } from './paragraph';

export interface IParagraphs {
  insert(p: IParagraph): void;
  delete(id: string): void;
  update(id: string, p: IParagraph): void;
  undo(): void;
  redo(): void;
}
