import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRange, isExactHand } from './range.js';

const count = (r) => parseRange(r).length;

test('combo counts', () => {
  assert.equal(count('AA'), 6);
  assert.equal(count('AKs'), 4);
  assert.equal(count('AKo'), 12);
  assert.equal(count('AK'), 16);
  assert.equal(count('KA'), 16);
  assert.equal(count('QQ+'), 18);
  assert.equal(count('22+'), 78);
  assert.equal(count('22-55'), 24);
  assert.equal(count('ATs+'), 16);
  assert.equal(count('KJo+'), 24);
  assert.equal(count('A2s-A5s'), 16);
  assert.equal(count('AhKd'), 1);
  assert.equal(count('QQ+, AKs, AhKs'), 18 + 4 + 1); // AhKs is offsuit, so it adds 1
  assert.equal(count('AKs, AsKs'), 4); // duplicates removed
});

test('all hands = 1326 combos', () => {
  const all = [];
  const R = '23456789TJQKA';
  for (let i = 0; i < 13; i++) {
    all.push(`${R[i]}${R[i]}`);
    for (let j = 0; j < i; j++) all.push(`${R[i]}${R[j]}`);
  }
  assert.equal(count(all.join(',')), 1326);
});

test('rejects bad input', () => {
  assert.throws(() => parseRange('XX'));
  assert.throws(() => parseRange('AKs-QJs'));
  assert.throws(() => parseRange(''));
});

test('isExactHand', () => {
  assert.ok(isExactHand('AhKd'));
  assert.ok(isExactHand('Ah Kd'));
  assert.ok(!isExactHand('AK'));
  assert.ok(!isExactHand('QQ+'));
});
