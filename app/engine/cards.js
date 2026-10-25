// Card encoding: id = rank * 4 + suit, rank 0 = '2' ... 12 = 'A', suit 0..3 = s h d c.

export const RANKS = '23456789TJQKA';
export const SUITS = 'shdc';

export function parseCard(text) {
  if (typeof text !== 'string' || text.length !== 2) {
    throw new Error(`Bad card "${text}". Use rank + suit, like Ah or Td.`);
  }
  const rank = RANKS.indexOf(text[0].toUpperCase());
  const suit = SUITS.indexOf(text[1].toLowerCase());
  if (rank < 0 || suit < 0) {
    throw new Error(`Bad card "${text}". Ranks: ${RANKS}, suits: ${SUITS}.`);
  }
  return rank * 4 + suit;
}

// Accepts "AhKd", "Ah Kd", "Ah,Kd" or an array of strings/ids.
export function parseCards(input) {
  if (input == null || input === '') return [];
  if (Array.isArray(input)) {
    return input.map((c) => (typeof c === 'number' ? c : parseCard(c)));
  }
  const clean = String(input).replace(/[\s,]/g, '');
  if (clean.length % 2 !== 0) throw new Error(`Bad card list "${input}".`);
  const cards = [];
  for (let i = 0; i < clean.length; i += 2) cards.push(parseCard(clean.slice(i, i + 2)));
  return cards;
}

export function cardToString(id) {
  return RANKS[id >> 2] + SUITS[id & 3];
}

export function cardsToString(ids) {
  return ids.map(cardToString).join(' ');
}

export const rankOf = (id) => id >> 2;
export const suitOf = (id) => id & 3;

export function fullDeck() {
  return Array.from({ length: 52 }, (_, i) => i);
}

// Throws if any card appears twice.
export function assertNoDuplicates(cards) {
  const seen = new Set();
  for (const c of cards) {
    if (seen.has(c)) throw new Error(`Card ${cardToString(c)} is used twice.`);
    seen.add(c);
  }
}
