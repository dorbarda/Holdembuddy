import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, DRILL_TOPICS } from '../learn/lessons.js';
import { TOPICS } from './drills.js';
import { run } from './api.js';

test('lessons: pot odds labels agree with their numbers', () => {
  for (const l of LESSONS) {
    for (const ex of l.examples.filter((e) => e.type === 'potOdds')) {
      const m = ex.label.match(/pot was (\d+), he bets (\d+), you call (\d+)/);
      assert.ok(m, ex.label);
      const [, before, bet, call] = m.map(Number);
      assert.equal(ex.pot, before + bet, ex.label);
      assert.equal(ex.call, call, ex.label);
      assert.equal(bet, call, ex.label);
    }
  }
});

test('lessons: every example runs in the engine, topics exist', () => {
  for (const l of LESSONS) {
    if (l.topic) assert.ok(TOPICS[l.topic], l.id);
    for (const ex of l.examples) {
      if (ex.type === 'potOdds') run('potOdds', ex);
      else if (ex.type === 'stack') run('stack', ex);
      else if (ex.type === 'draw') run('drawChance', ex);
      else if (ex.type === 'equity') assert.equal(ex.players.length, 2);
      else assert.fail(`unknown example type ${ex.type}`);
    }
  }
  for (const t of DRILL_TOPICS) assert.ok(TOPICS[t]);
});
