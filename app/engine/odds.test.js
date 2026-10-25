import { test } from 'node:test';
import assert from 'node:assert/strict';
import { potOdds, stackInfo, outs } from './odds.js';
import { cardsToString } from './cards.js';

test('pot odds', () => {
  const r = potOdds(300, 100);
  assert.equal(r.ratio, 3);
  assert.equal(r.equityNeeded, 0.25);
  assert.throws(() => potOdds(0, 100));
});

test('stack size and M-ratio', () => {
  const s = stackInfo({ stack: 4500, sb: 100, bb: 200, ante: 25, players: 9 });
  assert.equal(s.bigBlinds, 22.5);
  assert.equal(s.orbitCost, 100 + 200 + 225);
  assert.equal(s.mRatio, 4500 / 525);
  const bba = stackInfo({ stack: 4500, sb: 100, bb: 200, ante: 200, bbAnte: true });
  assert.equal(bba.orbitCost, 500);
});

test('outs: flush draw vs a set, one heart pairs the board', () => {
  const r = outs('AhKh', 'QsQd', 'Qh7h2c');
  assert.ok(r.behind);
  // 9 hearts left; 2h gives the set a full house, so 8 clean outs.
  assert.equal(cardsToString(r.outs), '3h 4h 5h 6h 8h 9h Th Jh');
  assert.equal(r.unseen, 45);
});

test('outs: not behind = no outs', () => {
  const r = outs('QsQd', 'AhKh', 'Qh7h2c');
  assert.equal(r.behind, false);
  assert.equal(r.outs.length, 0);
});
