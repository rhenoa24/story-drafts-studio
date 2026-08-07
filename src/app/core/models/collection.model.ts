export interface Collection {
  id: string;
  name: string;
  /** null = top-level collection */
  parentId: string | null;
  chapterIds: string[];
}
