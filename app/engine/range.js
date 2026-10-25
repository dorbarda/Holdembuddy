// Range notation -> list of two-card combos.
// Supports: AA, QQ+, 22-55, AKs, AKo, AK, ATs+, KJo+, A2s-A5s, explicit combos like AhKh.
// Separate parts with commas: "QQ+, AKs, AhKd".

import { RANKS, SUITS, parseCards } from './cards.js';

const rankIndex = (ch) => {
  const r = RANKS.indexOf(ch.toUpperCase());
  if (r < 0) throw new Error(`Bad rank "${ch}".`);
  return r;
};

function pairCombos(r) {
  const out = [];
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) out.push([r * 4 + a, r * 4 + b]);
  return out;
}

function nonPairCombos(hi, lo, kind) {
  const out = [];
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      const suited = a === b;
      if (kind === 's' && !suited) continue;
      if (kind === 'o' && suited) continue;
      out.push([hi * 4 + a, lo * 4 + b]);
    }
  }
  return out;
}

// One hand class like "AKs", "QQ", "T9".
function classCombos(hi, lo, kind) {
  if (hi === lo) return pairCombos(hi);
  if (hi < lo) [hi, lo] = [lo, hi];
  return nonPairCombos(hi, lo, kind);
}

function parseClass(text) {
  const m = /^([2-9TJQKA])([2-9TJQKA])([so]?)$/i.exec(text);
  if (!m) return null;
  return { hi: rankIndex(m[1]), lo: rankIndex(m[2]), kind: m[3].toLowerCase() };
}

function parsePart(part) {
  // Explicit combo: AhKd
  if (/^[2-9TJQKA][shdc][2-9TJQKA][shdc]$/i.test(part)) {
    const [a, b] = parseCards(part);
    if (a === b) throw new Error(`Bad combo "${part}".`);
    return [[a, b]];
  }

  // Dash: 22-55, A2s-A5s
  if (part.includes('-')) {
    const [from, to] = part.split('-').map(parseClass);
    if (!from || !to || from.kind !== to.kind) throw new Error(`Bad range "${part}".`);
    const out = [];
    if (from.hi === from.lo && to.hi === to.lo) {
      const [a, b] = [Math.min(from.hi, to.hi), Math.max(from.hi, to.hi)];
      for (let r = a; r <= b; r++) out.push(...pairCombos(r));
      return out;
    }
    if (from.hi !== to.hi) throw new Error(`Bad range "${part}": first card must match.`);
    const [a, b] = [Math.min(from.lo, to.lo), Math.max(from.lo, to.lo)];
    for (let r = a; r <= b; r++) out.push(...classCombos(from.hi, r, from.kind));
    return out;
  }

  // Plus: QQ+, ATs+
  if (part.endsWith('+')) {
    const c = parseClass(part.slice(0, -1));
    if (!c) throw new Error(`Bad range "${part}".`);
    const out = [];
    if (c.hi === c.lo) {
      for (let r = c.hi; r <= 12; r++) out.push(...pairCombos(r));
    } else {
      let { hi, lo } = c;
      if (hi < lo) [hi, lo] = [lo, hi];
      for (let r = lo; r < hi; r++) out.push(...classCombos(hi, r, c.kind));
    }
    return out;
  }

  const c = parseClass(part);
  if (!c) throw new Error(`Bad range part "${part}".`);
  return classCombos(c.hi, c.lo, c.kind);
}

export function parseRange(text) {
  const seen = new Set();
  const combos = [];
  for (const raw of String(text).split(',')) {
    const part = raw.trim();
    if (!part) continue;
    for (const [a, b] of parsePart(part)) {
      const key = a < b ? a * 52 + b : b * 52 + a;
      if (seen.has(key)) continue;
      seen.add(key);
      combos.push([a, b]);
    }
  }
  if (combos.length === 0) throw new Error(`Empty range "${text}".`);
  return combos;
}

// True if the text is exactly one two-card hand (e.g. "AhKd").
export function isExactHand(text) {
  return /^\s*[2-9TJQKA][shdc]\s*[2-9TJQKA][shdc]\s*$/i.test(String(text));
}

export { SUITS };
