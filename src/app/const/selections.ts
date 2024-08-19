import { PlayerType } from '@/types/player.types';

export const selections: { name: PlayerType; text: string; icon: string }[] = [
  {
    name: 'computer',
    text: 'AI Computer',
    icon: '🤖',
  },
  {
    name: 'local',
    text: 'Local player',
    icon: '👩‍🦰',
  },
  {
    name: 'remote',
    text: 'Remote player',
    icon: '🌍',
  },
];
