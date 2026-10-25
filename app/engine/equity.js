// Equity: chance to win for each player.
// Exact: counts every possible board (and every range combo) when the work is small enough.
// Simulation: random boards with a fixed seed; reports the number of runs and a 95% margin.

import { evaluate } from './evaluator.js';
import { parseCards, assertNoDuplicates } from './cards.js';
import { parseRange, isExactHand } from './range.js';

export const EXACT_LIMIT = 3_000_000; // max (combo sets x boards) for exact mode
export const DEFAULT_RUNS = 200_000;

function choose(n, k) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

// Seeded random numbers (mulberry32), so results repeat.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Player input: "AhKd" (exact hand), "QQ+,AKs" (range) or an array of combos.
function toCombos(player) {
  if (Array.isArray(player)) {
    if (player.length === 2 && typeof player[0] !== 'object') return [parseCards(player)];
    return player.map((c) => parseCards(c));
  }
  if (isExactHand(player)) return [parseCards(player)];
  return parseRange(player);
}

// Score one finished board. Fills got[p] with the player's pot share (1, 1/k on a k-way tie, or 0).
function scoreBoard(hands, board, got, scores) {
  let best = -1;
  let count = 0;
  for (let p = 0; p < hands.length; p++) {
    const s = evaluate(hands[p].concat(board));
    scores[p] = s;
    if (s > best) {
      best = s;
      count = 1;
    } else if (s === best) count++;
  }
  for (let p = 0; p < hands.length; p++) got[p] = scores[p] === best ? 1 / count : 0;
}

function makeTally(n) {
  return { win: new Float64Array(n), tie: new Float64Array(n), eq: new Float64Array(n), sq: new Float64Array(n) };
}

function addToTally(tally, got) {
  for (let p = 0; p < got.length; p++) {
    const g = got[p];
    if (g === 1) tally.win[p]++;
    else if (g > 0) tally.tie[p]++;
    tally.eq[p] += g;
    tally.sq[p] += g * g;
  }
}

// All k-card subsets of `deck`, calling fn(subset).
function forEachSubset(deck, k, fn) {
  const idx = Array.from({ length: k }, (_, i) => i);
  const pick = new Array(k);
  const n = deck.length;
  if (k === 0) return fn([]);
  while (true) {
    for (let i = 0; i < k; i++) pick[i] = deck[idx[i]];
    fn(pick);
    let i = k - 1;
    while (i >= 0 && idx[i] === n - k + i) i--;
    if (i < 0) return;
    idx[i]++;
    for (let j = i + 1; j < k; j++) idx[j] = idx[j - 1] + 1;
  }
}

// Every non-conflicting choice of one combo per player.
function forEachComboSet(comboLists, used, fn, p = 0, chosen = []) {
  if (p === comboLists.length) return fn(chosen);
  for (const combo of comboLists[p]) {
    if (used.has(combo[0]) || used.has(combo[1])) continue;
    used.add(combo[0]);
    used.add(combo[1]);
    chosen.push(combo);
    forEachComboSet(comboLists, used, fn, p + 1, chosen);
    chosen.pop();
    used.delete(combo[0]);
    used.delete(combo[1]);
  }
}

function countComboSets(comboLists, used) {
  let n = 0;
  forEachComboSet(comboLists, used, () => n++);
  return n;
}

/**
 * equity(players, { board, dead, mode, runs, seed })
 * players: array of hands or ranges, e.g. ["AhKh", "QQ+,AKs"]
 * mode: "auto" (default), "exact" or "sim"
 * Returns { mode, players: [{ win, tie, equity }], boards, runs, margin }
 * win = wins alone, tie = splits the pot, equity = win + tie share. All fractions (0..1).
 * margin = 95% margin on equity (sim only).
 */
export function equity(players, opts = {}) {
  if (!Array.isArray(players) || players.length < 2) throw new Error('Need at least 2 players.');
  const board = parseCards(opts.board ?? []);
  const dead = parseCards(opts.dead ?? []);
  if (board.length > 5) throw new Error('Board has more than 5 cards.');
  assertNoDuplicates([...board, ...dead]);

  const used = new Set([...board, ...dead]);
  const comboLists = players.map((p) => toCombos(p).filter(([a, b]) => !used.has(a) && !used.has(b)));
  comboLists.forEach((list, i) => {
    if (list.length === 0) throw new Error(`Player ${i + 1} has no possible hands (cards already used).`);
  });

  const toDeal = 5 - board.length;
  const remaining = 52 - used.size - 2 * players.length;
  const boardsPerSet = choose(remaining, toDeal);
  const allFixed = comboLists.every((l) => l.length === 1);
  if (allFixed) assertNoDuplicates([...board, ...dead, ...comboLists.flat(2)]);

  let mode = opts.mode ?? 'auto';
  if (mode === 'auto') {
    // Estimate combo sets cheaply: product of list sizes is an upper bound.
    const upper = comboLists.reduce((m, l) => m * l.length, 1);
    const sets = upper * boardsPerSet <= EXACT_LIMIT ? upper : countComboSets(comboLists, used);
    mode = sets * boardsPerSet <= EXACT_LIMIT ? 'exact' : 'sim';
  }

  return mode === 'exact'
    ? exact(comboLists, board, used, toDeal)
    : simulate(comboLists, board, used, toDeal, opts.runs ?? DEFAULT_RUNS, opts.seed ?? 1);
}

function exact(comboLists, board, used, toDeal) {
  const n = comboLists.length;
  const tally = makeTally(n);
  const got = new Float64Array(n);
  const scores = new Int32Array(n);
  let boards = 0;
  forEachComboSet(comboLists, used, (hands) => {
    const taken = new Set(used);
    for (const h of hands) taken.add(h[0]).add(h[1]);
    const deck = [];
    for (let c = 0; c < 52; c++) if (!taken.has(c)) deck.push(c);
    forEachSubset(deck, toDeal, (extra) => {
      scoreBoard(hands, board.concat(extra), got, scores);
      addToTally(tally, got);
      boards++;
    });
  });
  if (boards === 0) throw new Error('No possible deals (hands overlap).');
  return result('exact', tally, boards);
}

function simulate(comboLists, board, used, toDeal, runs, seed) {
  const n = comboLists.length;
  const tally = makeTally(n);
  const got = new Float64Array(n);
  const scores = new Int32Array(n);
  const random = rng(seed);
  let done = 0;
  let tries = 0;
  const hands = new Array(n);
  const extra = new Array(toDeal);
  while (done < runs) {
    if (++tries > runs * 50) throw new Error('Could not deal hands without overlap. Check the ranges.');
    const taken = new Set(used);
    let ok = true;
    for (let p = 0; p < n && ok; p++) {
      const list = comboLists[p];
      const combo = list[Math.floor(random() * list.length)];
      if (taken.has(combo[0]) || taken.has(combo[1])) ok = false;
      else {
        taken.add(combo[0]).add(combo[1]);
        hands[p] = combo;
      }
    }
    if (!ok) continue; // rejection keeps every valid combo set equally likely
    for (let i = 0; i < toDeal; i++) {
      let c;
      do c = Math.floor(random() * 52);
      while (taken.has(c));
      taken.add(c);
      extra[i] = c;
    }
    scoreBoard(hands, board.concat(extra), got, scores);
    addToTally(tally, got);
    done++;
  }
  const res = result('sim', tally, done);
  res.runs = done;
  res.players.forEach((pl, p) => {
    const variance = Math.max(0, tally.sq[p] / done - pl.equity * pl.equity);
    pl.margin = 1.96 * Math.sqrt(variance / done);
  });
  res.margin = Math.max(...res.players.map((p) => p.margin));
  return res;
}

function result(mode, tally, boards) {
  const players = [];
  for (let p = 0; p < tally.win.length; p++) {
    players.push({ win: tally.win[p] / boards, tie: tally.tie[p] / boards, equity: tally.eq[p] / boards });
  }
  return { mode, players, boards, margin: null };
}
