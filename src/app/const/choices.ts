import { GameChoice } from '@/types/game.types';

export const choices: GameChoice[] = [
  {
    name: 'rock',
    beats: ['scissors'],
    icon: '✊',
  },
  {
    name: 'paper',
    beats: ['rock'],
    icon: '🖐',
  },
  {
    name: 'scissors',
    beats: ['paper'],
    icon: '✌️',
  },
];

// export const choices = [
//   {
//     name: 'rock',
//     beats: ['scissors', 'lizard'],
//     icon: '✊',
//   },
//   {
//     name: 'paper',
//     beats: ['rock', 'spock'],
//     icon: '🖐',
//   },
//   {
//     name: 'scissors',
//     beats: ['paper', 'lizard'],
//     icon: '✌️',
//   },
//   {
//     name: 'lizard',
//     beats: ['paper', 'spock'],
//     icon: '🤘',
//   },
//   {
//     name: 'spock',
//     beats: ['rock', 'scissors'],
//     icon: '🖖',
//   },
// ];
