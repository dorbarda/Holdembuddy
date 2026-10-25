import { test } from 'node:test';
import assert from 'node:assert/strict';
import { equity } from './equity.js';

const sum = (res) => res.players.reduce((s, p) => s + p.equity, 0);

test('equity adds up to 100%', () => {
  for (const res of [
    equity(['AhKh', 'QsQd'], { board: '7c2d9s' }),
    equity(['AsAd', 'KsKd', '7c6c'], { board: 'Jh' }),
    equity(['AhKd', 'QQ+,AKs'], { board: 'Qh7h2c' }),
  ]) {
    assert.ok(Math.abs(sum(res) - 1) < 1e-9);
  }
});

test('same hand with other suits = 50/50 when no flush is possible', () => {
  const res = equity(['AhKd', 'AdKh'], { board: '2c3c4s' });
  // Each player has one heart and one diamond, and the board has none: no flush possible, always a tie.
  assert.equal(res.players[0].equity, 0.5);
  assert.equal(res.players[1].equity, 0.5);
});

test('exact counts every deal', () => {
  assert.equal(equity(['AhKh', 'QsQd']).boards, 1712304); // C(48,5)
  assert.equal(equity(['AhKh', 'QsQd'], { board: 'Qh7h2c' }).boards, 990); // C(45,2)
  assert.equal(equity(['AhKh', 'QsQd'], { board: 'Qh7h2c3d' }).boards, 44);
});

test('river: result is 0, 0.5 or 1', () => {
  const win = equity(['AhKh', 'QsQd'], { board: 'Th Jh 2h 3c 4d' }); // AhKh makes an ace-high flush
  assert.equal(win.players[0].equity, 1);
  const lose = equity(['AhKd', 'QsQd'], { board: 'Qh7c2c3d9s' });
  assert.equal(lose.players[0].equity, 0);
});

test('simulation lands close to the exact answer', () => {
  const exact = equity(['AhKd', 'QQ+,AKs'], { board: 'Qh7h2c', mode: 'exact' });
  const sim = equity(['AhKd', 'QQ+,AKs'], { board: 'Qh7h2c', mode: 'sim', runs: 100000, seed: 7 });
  assert.equal(sim.mode, 'sim');
  const diff = Math.abs(exact.players[0].equity - sim.players[0].equity);
  assert.ok(diff < sim.players[0].margin * 1.5, `diff ${diff} vs margin ${sim.players[0].margin}`);
});

test('simulation repeats with the same seed', () => {
  const a = equity(['AhKd', 'QQ+'], { mode: 'sim', runs: 20000, seed: 3 });
  const b = equity(['AhKd', 'QQ+'], { mode: 'sim', runs: 20000, seed: 3 });
  assert.deepEqual(a, b);
});

test('rejects impossible input', () => {
  assert.throws(() => equity(['AhKh', 'AhQd']), /twice/);
  assert.throws(() => equity(['AhKh', 'QsQd'], { board: 'Ah2c3c' }), /no possible hands|twice/);
  assert.throws(() => equity(['AhKh']), /2 players/);
});
