// One entry point for the app: run(fn, args) -> plain JSON result.
// Used by the Web Worker and as a fallback on the page itself.

import { equity } from './equity.js';
import { potOdds, stackInfo, outs } from './odds.js';
import { cardsToString } from './cards.js';
import { parseRange, isExactHand } from './range.js';

export function run(fn, args = {}) {
  switch (fn) {
    case 'equity': {
      const res = equity(args.players, { board: args.board, dead: args.dead, mode: args.mode, runs: args.runs, seed: args.seed });
      return res;
    }
    case 'outs': {
      const res = outs(args.hero, args.villain, args.board);
      return { ...res, outs: cardsToString(res.outs).split(' ').filter(Boolean), tieOuts: cardsToString(res.tieOuts).split(' ').filter(Boolean) };
    }
    case 'potOdds':
      return potOdds(Number(args.pot), Number(args.call));
    case 'stack':
      return stackInfo({
        stack: Number(args.stack),
        sb: Number(args.sb),
        bb: Number(args.bb),
        ante: Number(args.ante ?? 0),
        players: Number(args.players ?? 9),
        bbAnte: Boolean(args.bbAnte),
      });
    case 'rangeSize':
      return { combos: isExactHand(args.range) ? 1 : parseRange(args.range).length };
    default:
      throw new Error(`Unknown engine call "${fn}".`);
  }
}
