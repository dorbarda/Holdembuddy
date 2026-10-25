// Simple poker math: pot odds, stack size, outs.

import { evaluate } from './evaluator.js';
import { parseCards, assertNoDuplicates } from './cards.js';

/**
 * Pot odds for a call.
 * pot  = everything in the middle now, including the bet you face.
 * call = chips you must add.
 * Returns { ratio, equityNeeded } — ratio is "pot : call" as one number (3 means 3 : 1).
 */
export function potOdds(pot, call) {
  if (!(pot > 0) || !(call > 0)) throw new Error('Pot and call must be more than 0.');
  return { ratio: pot / call, equityNeeded: call / (pot + call) };
}

/**
 * Stack size in a tournament.
 * ante = per player (classic ante), or set bbAnte = true when the big blind pays one ante for the table.
 * Returns { bigBlinds, orbitCost, mRatio }.
 * M-ratio = stack / cost of one full orbit (small blind + big blind + all antes).
 */
export function stackInfo({ stack, sb, bb, ante = 0, players = 9, bbAnte = false }) {
  if (!(stack > 0) || !(bb > 0) || !(sb >= 0)) throw new Error('Stack and blinds must be more than 0.');
  const antes = bbAnte ? ante : ante * players;
  const orbitCost = sb + bb + antes;
  return { bigBlinds: stack / bb, orbitCost, mRatio: stack / orbitCost };
}

/**
 * Outs: cards on the next street that put the hero ahead of a known villain hand.
 * Works on the flop (3 cards) or turn (4 cards).
 * Returns { behind, outs: [card ids], tieOuts: [card ids], unseen, nextCardChance }.
 */
export function outs(hero, villain, board) {
  const h = parseCards(hero);
  const v = parseCards(villain);
  const b = parseCards(board);
  if (h.length !== 2 || v.length !== 2) throw new Error('Hero and villain need 2 cards each.');
  if (b.length !== 3 && b.length !== 4) throw new Error('Outs work on the flop (3 cards) or turn (4 cards).');
  assertNoDuplicates([...h, ...v, ...b]);

  const now = Math.sign(evaluate([...h, ...b]) - evaluate([...v, ...b]));
  const used = new Set([...h, ...v, ...b]);
  const win = [];
  const tie = [];
  let unseen = 0;
  for (let c = 0; c < 52; c++) {
    if (used.has(c)) continue;
    unseen++;
    const d = Math.sign(evaluate([...h, ...b, c]) - evaluate([...v, ...b, c]));
    if (now < 0 && d > 0) win.push(c);
    if (now < 0 && d === 0) tie.push(c);
  }
  return {
    behind: now < 0,
    outs: win,
    tieOuts: tie,
    unseen,
    nextCardChance: win.length / unseen,
  };
}

/**
 * Chance to hit at least one of `outsCount` cards when `cardsToCome` cards are dealt
 * from `unseen` cards (exact, no shortcut). Example: 9 outs, 47 unseen, 2 cards = flop to river.
 */
export function drawChance(outsCount, unseen, cardsToCome = 1) {
  if (!(unseen > 0) || outsCount < 0 || outsCount > unseen) throw new Error('Bad outs or unseen cards.');
  let miss = 1;
  for (let i = 0; i < cardsToCome; i++) miss *= (unseen - outsCount - i) / (unseen - i);
  return 1 - miss;
}
