import { test } from 'node:test';
import assert from 'node:assert/strict';
import { run } from './api.js';

test('api: equity, outs, pot odds, stack, range size', () => {
  const eq = run('equity', { players: ['AhKh', 'QsQd'], board: 'Qh7h2c' });
  assert.equal(eq.boards, 990);
  const o = run('outs', { hero: 'AhKh', villain: 'QsQd', board: 'Qh7h2c' });
  assert.deepEqual(o.outs, ['3h', '4h', '5h', '6h', '8h', '9h', 'Th', 'Jh']);
  assert.equal(run('potOdds', { pot: 300, call: 100 }).equityNeeded, 0.25);
  assert.equal(run('stack', { stack: 4500, sb: 100, bb: 200, ante: 25, players: 9 }).bigBlinds, 22.5);
  assert.equal(run('rangeSize', { range: 'QQ+, AKs' }).combos, 22);
  assert.equal(run('rangeSize', { range: 'AhKd' }).combos, 1);
  assert.throws(() => run('nope'));
});
