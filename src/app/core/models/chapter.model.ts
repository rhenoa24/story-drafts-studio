import { Block } from './block.model';

export interface Chapter {
  id: string;
  title: string;
  /** A chapter may belong to multiple collections */
  collectionIds: string[];
  blocks: Block[];
}
