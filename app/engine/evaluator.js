// Hand evaluator for 5 to 7 cards. Returns a score: higher score = better hand.
// score = category << 20 | five 4-bit kicker ranks (highest first).

export const CATEGORY_NAMES = [
  'High card',
  'Pair',
  'Two pair',
  'Three of a kind',
  'Straight',
  'Flush',
  'Full house',
  'Four of a kind',
  'Straight flush',
];

const WHEEL = 0b1000000001111; // A 5 4 3 2

// Highest straight in a rank bitmask: returns top rank, or -1.
function straightHigh(mask) {
  for (let high = 12; high >= 4; high--) {
    const need = 0b11111 << (high - 4);
    if ((mask & need) === need) return high;
  }
  return (mask & WHEEL) === WHEEL ? 3 : -1;
}

function pack(category, k) {
  return (
    (category << 20) |
    ((k[0] ?? 0) << 16) |
    ((k[1] ?? 0) << 12) |
    ((k[2] ?? 0) << 8) |
    ((k[3] ?? 0) << 4) |
    (k[4] ?? 0)
  );
}

// Top n ranks from a bitmask, highest first.
function topRanks(mask, n, out = []) {
  for (let r = 12; r >= 0 && out.length < n; r--) if (mask & (1 << r)) out.push(r);
  return out;
}

const rankCount = new Int8Array(13);
const suitMask = new Int32Array(4);
const suitCount = new Int8Array(4);

export function evaluate(cards) {
  rankCount.fill(0);
  suitMask.fill(0);
  suitCount.fill(0);
  let rankMask = 0;
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    const r = c >> 2;
    const s = c & 3;
    rankCount[r]++;
    suitCount[s]++;
    suitMask[s] |= 1 << r;
    rankMask |= 1 << r;
  }

  // Flush / straight flush
  for (let s = 0; s < 4; s++) {
    if (suitCount[s] >= 5) {
      const sf = straightHigh(suitMask[s]);
      if (sf >= 0) return pack(8, [sf]);
      // A flush beats everything below except quads / full house; check those first.
      const flushScore = pack(5, topRanks(suitMask[s], 5));
      const better = quadsOrFullHouse(rankMask);
      return better > flushScore ? better : flushScore;
    }
  }

  const qf = quadsOrFullHouse(rankMask);
  if (qf) return qf;

  const st = straightHigh(rankMask);
  if (st >= 0) return pack(4, [st]);

  let trips = -1;
  let pairHigh = -1;
  let pairLow = -1;
  for (let r = 12; r >= 0; r--) {
    if (rankCount[r] === 3 && trips < 0) trips = r;
    else if (rankCount[r] === 2) {
      if (pairHigh < 0) pairHigh = r;
      else if (pairLow < 0) pairLow = r;
    }
  }
  if (trips >= 0) {
    return pack(3, [trips, ...topRanks(rankMask & ~(1 << trips), 2)]);
  }
  if (pairLow >= 0) {
    const rest = rankMask & ~(1 << pairHigh) & ~(1 << pairLow);
    return pack(2, [pairHigh, pairLow, ...topRanks(rest, 1)]);
  }
  if (pairHigh >= 0) {
    return pack(1, [pairHigh, ...topRanks(rankMask & ~(1 << pairHigh), 3)]);
  }
  return pack(0, topRanks(rankMask, 5));
}

// Uses rankCount filled by evaluate(). Returns 0 if neither.
function quadsOrFullHouse(rankMask) {
  let trips = -1;
  let pair = -1;
  for (let r = 12; r >= 0; r--) {
    if (rankCount[r] === 4) {
      return pack(7, [r, ...topRanks(rankMask & ~(1 << r), 1)]);
    }
  }
  for (let r = 12; r >= 0; r--) {
    if (rankCount[r] === 3) {
      if (trips < 0) trips = r;
      else if (pair < 0) pair = r; // second set of trips counts as the pair
    } else if (rankCount[r] === 2 && pair < 0) {
      pair = r;
    }
  }
  if (trips >= 0 && pair >= 0) return pack(6, [trips, pair]);
  return 0;
}

export function categoryOf(score) {
  return score >> 20;
}

export function categoryName(score) {
  return CATEGORY_NAMES[categoryOf(score)];
}
