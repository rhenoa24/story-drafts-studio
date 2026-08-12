import { Character, Chapter, Collection } from '../models';

export const SEED_CHARACTERS: Character[] = [
  {
    id: 'char-mira',
    name: 'Mira',
    description: 'A cartographer who has stopped trusting maps.',
    nameplateColor: '#3A5A6E'
  },
  {
    id: 'char-holt',
    name: 'Holt',
    description: 'A lighthouse keeper with too much time to think.',
    nameplateColor: '#7A2E3A'
  }
];

export const SEED_CHAPTERS: Chapter[] = [
  {
    id: 'chap-1',
    title: 'The Last Coastline',
    collectionIds: ['col-main'],
    blocks: [
      {
        id: 'blk-1',
        type: 'scene',
        locationName: 'Northern Cliffs',
        timeOfDay: 'Dusk',
        backgroundLabel: 'cliffs_dusk.png'
      },
      {
        id: 'blk-2',
        type: 'narration',
        html: '<p>The wind carried salt and old arguments up the cliff path. <em>Mira</em> had walked it a hundred times, but never with a map that agreed with the ground beneath her.</p>'
      },
      {
        id: 'blk-3',
        type: 'dialogue',
        characterId: 'char-mira',
        html: "<p>The coastline moved again. That's the third time this year.</p>",
        align: 'left'
      },
      {
        id: 'blk-4',
        type: 'dialogue',
        characterId: 'char-holt',
        html: "<p>Maybe it's not the coastline that's moving.</p>",
        align: 'right'
      },
      {
        id: 'blk-5',
        type: 'narration',
        html: '<p>Below them, the lighthouse blinked once, twice, then held its light steady &mdash; as if it, too, was waiting for an answer.</p>'
      }
    ]
  },
  {
    id: 'chap-2',
    title: 'What the Lighthouse Knew',
    collectionIds: ['col-main'],
    blocks: [
      {
        id: 'blk-6',
        type: 'scene',
        locationName: 'The Lighthouse',
        timeOfDay: 'Night',
        backgroundLabel: 'lighthouse_interior.png'
      },
      {
        id: 'blk-7',
        type: 'dialogue',
        characterId: 'char-holt',
        html: "<p>Every keeper before me kept a log. I keep one too. Want to see what's different about mine?</p>",
        align: 'left'
      },
      {
        id: 'blk-8',
        type: 'narration',
        html: '<p>He opened a drawer that should not have existed in a room this small.</p>'
      }
    ]
  }
];

export const SEED_COLLECTIONS: Collection[] = [
  { id: 'col-root', name: 'The Last Coastline (Story)', parentId: null, chapterIds: [] },
  { id: 'col-main', name: 'Main Story', parentId: 'col-root', chapterIds: ['chap-1', 'chap-2'] },
  { id: 'col-flashbacks', name: 'Flashbacks', parentId: 'col-root', chapterIds: [] }
];