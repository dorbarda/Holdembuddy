import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, categoryName, categoryOf } from './evaluator.js';
import { parseCards } from './cards.js';

const score = (s) => evaluate(parseCards(s));
const name = (s) => categoryName(score(s));

test('names each category', () => {
  assert.equal(name('AsKsQsJsTs2d3c'), 'Straight flush');
  assert.equal(name('5h4h3h2hAh9c9d'), 'Straight flush');
  assert.equal(name('9s9h9d9cAs2d3c'), 'Four of a kind');
  assert.equal(name('KsKhKd2c2d7s8h'), 'Full house');
  assert.equal(name('KsKhKd2c2d2s8h'), 'Full house');
  assert.equal(name('As9s7s4s2sKdKc'), 'Flush');
  assert.equal(name('9s8h7d6c5sKdKc'), 'Straight');
  assert.equal(name('As2h3d4c5sKdQc'), 'Straight');
  assert.equal(name('7s7h7dAcKs2d3c'), 'Three of a kind');
  assert.equal(name('7s7h5d5cKs2d3c'), 'Two pair');
  assert.equal(name('7s7h5dAcKs2d3c'), 'Pair');
  assert.equal(name('AsJh9d7c5s3d2c'), 'High card');
});

test('compares hands in the right order', () => {
  const better = (a, b) => assert.ok(score(a) > score(b), `${a} should beat ${b}`);
  const same = (a, b) => assert.equal(score(a), score(b), `${a} should tie ${b}`);
  better('6s5h4d3c2s', 'As2h3d4c5s'); // 6-high straight beats the wheel
  better('AsKsQsJs9s', 'AsKhQdJcTs'); // flush beats straight
  better('AsAhKdQcJs', 'AsAhKdQc9s'); // kicker
  better('KsKhKd2c2d', 'QsQhQdAcAd'); // full house: trips first
  better('KsKhKdQcQd2s8h', 'KsKhKd2c2dJsJh'); // best pair for the full house
  better('7s7h5d5cAs', '7s7h5d5cKs'); // two pair kicker
  better('7s7h5d5c3s3dAh', '7s7h5d5c3s3dKh'); // third pair is not the kicker when an ace is there
  same('AsKsQhJd9c', 'AhKhQdJc9s'); // suits don't matter
  same('AsKsQhJd9c2d3c', 'AhKhQdJc9s4c2s'); // only best 5 count
});

test('5-card hand counts match combinatorics (all 2,598,960 hands)', () => {
  // Standard counts for 5-card poker hands.
  const expected = [1302540, 1098240, 123552, 54912, 10200, 5108, 3744, 624, 40];
  const counts = new Array(9).fill(0);
  const h = [0, 0, 0, 0, 0];
  for (h[0] = 0; h[0] < 48; h[0]++)
    for (h[1] = h[0] + 1; h[1] < 49; h[1]++)
      for (h[2] = h[1] + 1; h[2] < 50; h[2]++)
        for (h[3] = h[2] + 1; h[3] < 51; h[3]++)
          for (h[4] = h[3] + 1; h[4] < 52; h[4]++) counts[categoryOf(evaluate(h))]++;
  assert.deepEqual(counts, expected);
});
