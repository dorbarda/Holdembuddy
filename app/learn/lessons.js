// Math School lessons. Short, simple English.
// Numbers are never typed here: `examples` are calculated by the engine when the lesson opens.
// Mirrored for reading in knowledge/*.md.
// Example types:
//   { type: 'equity', players: ['QsQd', 'AhKc'], board?: '', label }
//   { type: 'draw', outs, unseen, cardsToCome, label }   (also shows the rule-of-2-and-4 shortcut)
//   { type: 'stack', stack, sb, bb, ante, players, bbAnte?, label }
//   { type: 'potOdds', pot, call, label }

export const LESSONS = [
  {
    id: 'positions',
    title: 'Positions',
    topic: null,
    body: [
      'Your position is where you sit compared to the dealer button. It decides when you act.',
      'Order before the flop: UTG (first to act), UTG+1, MP, HJ, CO (cutoff), BTN (button), SB (small blind), BB (big blind). After the flop, the button acts last.',
      'Acting last is a big edge: you see what everyone did before you decide.',
      'So: play fewer hands from early positions (UTG, MP). Play more hands from late positions (CO, BTN).',
      'The blinds act last before the flop but first after it, so they play many pots out of position.',
    ],
    examples: [],
  },
  {
    id: 'pot-odds',
    title: 'Pot odds',
    topic: 'potOdds',
    body: [
      'Pot odds tell you how often you must win to make a call worth it.',
      'Rule: equity needed = your call ÷ (pot + your call). "Pot" means everything in the middle now, including his bet.',
      'If your chance to win (equity) is higher than this number, the call makes money over time.',
      'Bigger bets need more equity to call. Small bets give you a good price.',
    ],
    examples: [
      { type: 'potOdds', pot: 300, call: 100, label: 'Half-pot bet: pot was 200, he bets 100, you call 100' },
      { type: 'potOdds', pot: 400, call: 200, label: 'Full-pot bet: pot was 200, he bets 200, you call 200' },
      { type: 'potOdds', pot: 600, call: 400, label: 'Double-pot bet: pot was 200, he bets 400, you call 400' },
    ],
  },
  {
    id: 'outs',
    title: 'Outs',
    topic: 'outs',
    body: [
      'Outs are the cards that will make your hand the best hand.',
      'A flush draw (4 cards of one suit) usually has 9 outs: 13 cards of the suit minus the 4 you see.',
      'An open-ended straight draw (like 8-7 on a 6-5-x board) usually has 8 outs.',
      'Careful: some outs help the villain too (for example, a card that pairs the board can give him a full house). Count only clean outs.',
      'Shortcut (not exact): outs × 2 ≈ % to hit on the next card, outs × 4 ≈ % from flop to river. The exact numbers are below.',
    ],
    examples: [
      { type: 'draw', outs: 9, unseen: 47, cardsToCome: 1, label: 'Flush draw on the flop, next card' },
      { type: 'draw', outs: 9, unseen: 47, cardsToCome: 2, label: 'Flush draw on the flop, by the river' },
      { type: 'draw', outs: 8, unseen: 47, cardsToCome: 2, label: 'Straight draw on the flop, by the river' },
      { type: 'draw', outs: 9, unseen: 46, cardsToCome: 1, label: 'Flush draw on the turn, river card' },
    ],
  },
  {
    id: 'equity',
    title: 'Equity basics',
    topic: 'equity',
    body: [
      'Equity is your share of the pot if all cards were dealt out: your chance to win, plus half your split pots.',
      'A pair against two higher cards is close to a coin flip, but the pair is a little ahead.',
      'A "dominated" hand shares a card with a better hand (AQ vs AK). It is far behind.',
      'Two high cards against two connected low cards is not a big edge either.',
    ],
    examples: [
      { type: 'equity', players: ['QsQd', 'AhKc'], label: 'Pair vs two higher cards (QQ vs AK)' },
      { type: 'equity', players: ['7s7d', 'AhKc'], label: 'Small pair vs AK (77 vs AK)' },
      { type: 'equity', players: ['AhKc', 'AdQs'], label: 'Dominated (AK vs AQ)' },
      { type: 'equity', players: ['AhKc', '8s7s'], label: 'High cards vs suited connectors (AK vs 87s)' },
    ],
  },
  {
    id: 'stack',
    title: 'Stack size and M-ratio',
    topic: 'stack',
    body: [
      'In tournaments, count your stack in big blinds (BB): chips ÷ big blind.',
      'M-ratio = your chips ÷ the cost of one full round (small blind + big blind + all antes). It shows how many rounds you can survive without playing a hand.',
      'Check your stack every time the blinds go up. Your best play changes with your stack size.',
      'Some games use a "big blind ante": the big blind pays one ante for the whole table.',
    ],
    examples: [
      { type: 'stack', stack: 3000, sb: 100, bb: 200, ante: 25, players: 9, label: '3,000 chips, blinds 100/200, ante 25, 9 players' },
      { type: 'stack', stack: 3000, sb: 100, bb: 200, ante: 200, players: 9, bbAnte: true, label: 'Same, but big blind ante of 200' },
    ],
  },
  {
    id: 'call-fold',
    title: 'Call or fold',
    topic: 'callFold',
    body: [
      'Now put it together: compare your equity with the equity you need (pot odds).',
      'Have more than you need: call. Have less: fold (or raise, if a bluff makes sense, but that is a later lesson).',
      'In real games you don’t see his cards. Then you use his likely range of hands. Odds Lab can calculate equity against a range.',
      'In these drills you see his cards, so you can check the math. You also see both the turn and the river for one call.',
    ],
    examples: [],
  },
  {
    id: 'push-fold',
    title: 'Push or fold (short stack)',
    topic: 'stack',
    idea: true,
    body: [
      'When your stack is short, a small raise and then a fold wastes chips. So you either go all-in (push) or fold.',
      'Many players switch to push-or-fold at around 10 to 15 big blinds. This is a rule of thumb (to validate).',
      'Which hands to push depends on your position, your stack and the players still to act. Fewer players behind you = you can push more hands.',
      'Pushing first is much better than calling an all-in: when you push, the others can fold and you win the blinds.',
      'Push/fold charts give exact hands. We will add them after we check a trusted source together.',
    ],
    examples: [],
  },
  {
    id: 'bubble',
    title: 'The bubble and ICM',
    topic: null,
    idea: true,
    body: [
      'The bubble is the moment just before the paid places. One more player out, and everyone left wins money.',
      'ICM (Independent Chip Model) turns tournament chips into prize money. Key idea: chips you lose hurt more than chips you win help.',
      'So near the bubble, medium stacks should avoid risky calls, especially against bigger stacks that can knock them out.',
      'Big stacks can push the medium stacks around, because those players don’t want to bust right before the money.',
      'Very short stacks still need to push sometimes, or the blinds will eat them.',
      'Exact ICM numbers need a calculator. Any ICM number here is "to validate".',
    ],
    examples: [],
  },
];

export const DRILL_TOPICS = ['potOdds', 'stack', 'outs', 'equity', 'callFold'];
