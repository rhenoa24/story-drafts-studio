export type BlockType = 'scene' | 'narration' | 'dialogue';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

/** Establishes the current setting. Replaces the previously active scene. */
export interface SceneBlock extends BaseBlock {
  type: 'scene';
  locationName: string;
  pointOfView?: string;
  backgroundLabel?: string;
}

/** Descriptive writing: scene description, thoughts, internal monologue. */
export interface NarrationBlock extends BaseBlock {
  type: 'narration';
  /** Rich text stored as HTML, per the project's data philosophy */
  html: string;
}

/** A single spoken line, referencing a Character by id. */
export interface DialogueBlock extends BaseBlock {
  type: 'dialogue';
  characterId: string;
  /** Rich text stored as HTML, per the project's data philosophy */
  html: string;
  align: 'left' | 'right';
}

export type Block = SceneBlock | NarrationBlock | DialogueBlock;

export function createEmptyBlock(type: BlockType, id: string): Block {
  switch (type) {
    case 'scene':
      return { id, type, locationName: 'New Location', pointOfView: '', backgroundLabel: '' };
    case 'narration':
      return { id, type, html: '<p>New narration...</p>' };
    case 'dialogue':
      return { id, type, characterId: '', html: '', align: 'left' };
  }
}
