import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeDrill, TOPICS } from './drills.js';
import { potOdds, outs } from './odds.js';
import { equity } from './equity.js';

test('every topic: answer is one of the options, options are unique, same seed = same question', () => {
  for (const topic of Object.keys(TOPICS)) {
    for (let seed = 1; seed <= 15; seed++) {
      const d = makeDrill(topic, seed);
      const labels = d.options.map((o) => o.label);
      assert.ok(labels.includes(d.answer), `${topic}/${seed}`);
      assert.equal(new Set(labels).size, labels.length, `${topic}/${seed} duplicate options`);
      assert.ok(labels.length >= 2);
      assert.deepEqual(makeDrill(topic, seed), d);
    }
  }
});

test('pot odds answers match the engine', () => {
  for (let seed = 1; seed <= 20; seed++) {
    const d = makeDrill('potOdds', seed);
    const [, pot, call] = d.question.replace(/,/g, '').match(/pot is (\d+) .* call (\d+)\./);
    assert.equal(d.answer, (potOdds(Number(pot), Number(call)).equityNeeded * 100).toFixed(2) + '%');
  }
});

test('outs and equity answers match the engine', () => {
  for (let seed = 1; seed <= 10; seed++) {
    const o = makeDrill('outs', seed);
    const r = outs(o.cards.hero, o.cards.villain, o.cards.board);
    assert.equal(o.answer, String(r.outs.length));

    const e = makeDrill('equity', seed);
    const eq = equity([e.cards.hero, e.cards.villain], { board: e.cards.board }).players[0].equity;
    const bucket = eq < 0.25 ? 'Under 25%' : eq < 0.5 ? '25% to 50%' : eq < 0.75 ? '50% to 75%' : 'Over 75%';
    assert.equal(e.answer, bucket);
  }
});

test('unknown topic throws', () => {
  assert.throws(() => makeDrill('nope'));
});
