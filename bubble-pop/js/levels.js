// Level definitions. The menu buttons are generated from this list, so adding a level here is enough.
//   targets – the sums to make; with more than one, the target changes every `every` pops
//   rise    – seconds a bubble takes to float from the bottom to the top (at the start of a round)
//   maxOn   – most bubbles on screen at once
//   partner – chance a new bubble is the partner of one already floating (the rest are random decoys)
//   frame   – show a ten-frame next to "3 + ? = 10" once a bubble is picked

export const LEVELS = [
  {
    id: 1, icon: '🫧', title: 'Make 10', blurb: 'Pop two bubbles that make 10. Nice and slow.', color: '#8ecae6',
    targets: [10], rise: 12, maxOn: 6, partner: .8, frame: true,
  },
  {
    id: 2, icon: '⚡', title: 'Speedy 10', blurb: 'Still 10, but more bubbles and faster!', color: '#ffd166',
    targets: [10], rise: 6.5, maxOn: 10, partner: .55, frame: false,
  },
  {
    id: 3, icon: '🎯', title: 'Switch it up', blurb: 'Make 6, 7, 8, 9 or 10. Watch the sign!', color: '#06d6a0',
    targets: [6, 7, 8, 9, 10], every: 5, rise: 10, maxOn: 7, partner: .7, frame: true,
  },
  {
    id: 4, icon: '🚀', title: 'Make 20', blurb: 'Big numbers, like 13 and 7.', color: '#f4a3c4',
    targets: [20], rise: 10, maxOn: 8, partner: .7, frame: false,
  },
];
