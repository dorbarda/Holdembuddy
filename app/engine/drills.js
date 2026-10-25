// Drill questions for Math School and /drill. Every answer is calculated by the engine.
// makeDrill(topic, seed) -> { topic, topicName, question, cards, options: [{ label, why }], answer, explain }
// The same seed always gives the same question.

import { rng, equity } from './equity.js';
import { potOdds, stackInfo, outs } from './odds.js';
import { cardToString } from './cards.js';

export const TOPICS = {
  potOdds: 'Pot odds',
  stack: 'Stack size',
  outs: 'Outs',
  equity: 'Equity',
  callFold: 'Call or fold',
};

const pct = (x) => (x * 100).toFixed(2) + '%';
const pick = (random, list) => list[Math.floor(random() * list.length)];
const fmt = (n) => Number(n).toLocaleString('en-US');

function shuffle(random, list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Keep the first option with each label; the answer must be first in `opts`.
function finish(random, base, opts) {
  const seen = new Set();
  const unique = opts.filter((o) => (seen.has(o.label) ? false : (seen.add(o.label), true)));
  return { ...base, options: shuffle(random, unique), answer: unique[0].label };
}

// Deal hero, villain and a board where hero is behind with 4-15 outs on the next card.
function dealDraw(random, boardSize) {
  for (let tries = 0; tries < 5000; tries++) {
    const deck = shuffle(random, Array.from({ length: 52 }, (_, i) => i));
    const hero = deck.slice(0, 2);
    const villain = deck.slice(2, 4);
    const board = deck.slice(4, 4 + boardSize);
    const r = outs(hero, villain, board);
    if (r.behind && r.outs.length >= 4 && r.outs.length <= 15) {
      return { hero, villain, board, r };
    }
  }
  throw new Error('Could not deal a drawing hand.');
}
const str = (ids) => ids.map(cardToString);

const makers = {
  potOdds(random) {
    const pot = pick(random, [100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1200]);
    const call = Math.max(25, Math.round((pot * (0.15 + random() * 0.6)) / 25) * 25);
    const r = potOdds(pot, call);
    return finish(random, {
      question: `The pot is ${fmt(pot)} after the bet. You must call ${fmt(call)}. How much equity do you need to call?`,
      explain: `${fmt(call)} ÷ (${fmt(pot)} + ${fmt(call)}) = ${pct(r.equityNeeded)}. Rule: call ÷ (pot + call).`,
    }, [
      { label: pct(r.equityNeeded), why: 'Right.' },
      { label: pct(call / pot), why: 'This is call ÷ pot. You forgot to add your own call to the pot.' },
      { label: pct(pot / (pot + call)), why: 'This is the pot’s share, not your call’s share.' },
      { label: pct(call / (pot + 2 * call)), why: 'This adds your call twice.' },
    ]);
  },

  stack(random) {
    const bb = pick(random, [100, 200, 300, 400, 600, 800, 1000, 2000]);
    const n = pick(random, [6, 8, 10, 12, 15, 18, 20, 25, 30, 40]);
    const stack = bb * n + (random() < 0.5 ? bb / 2 : 0);
    const sb = bb / 2;
    const r = stackInfo({ stack, sb, bb });
    const bbs = (x) => `${(Math.round(x * 10) / 10).toFixed(1)} BB`;
    return finish(random, {
      question: `Blinds are ${fmt(sb)}/${fmt(bb)}. You have ${fmt(stack)} chips. How many big blinds is that?`,
      explain: `${fmt(stack)} ÷ ${fmt(bb)} = ${bbs(r.bigBlinds)}. Divide your chips by the big blind.`,
    }, [
      { label: bbs(r.bigBlinds), why: 'Right.' },
      { label: bbs(stack / sb), why: 'You divided by the small blind.' },
      { label: bbs(stack / (sb + bb)), why: 'You divided by both blinds. That is the M-ratio (with no antes), not big blinds.' },
      { label: bbs(r.bigBlinds * 2), why: 'Too high: check the division again.' },
    ]);
  },

  outs(random) {
    const street = random() < 0.6 ? 3 : 4;
    const { hero, villain, board, r } = dealDraw(random, street);
    const n = r.outs.length;
    const next = street === 3 ? 'turn' : 'river';
    const wrong = [n + 2, n - 2, n + 4, n - 3].filter((x) => x >= 0).slice(0, 3);
    return finish(random, {
      question: `You can see the villain's cards. How many cards on the ${next} put you ahead?`,
      cards: { hero: str(hero), villain: str(villain), board: str(board) },
      explain: `${n} outs: ${str(r.outs).join(' ')}. Chance on the ${next}: ${n}/${r.unseen} = ${pct(r.nextCardChance)}.` +
        (r.tieOuts.length ? ` ${r.tieOuts.length} more card(s) give a split pot.` : ''),
    }, [{ label: String(n), why: 'Right.' }, ...wrong.map((x) => ({ label: String(x), why: 'Count only the cards that make you the best hand. Some cards that help you also help him more.' }))]);
  },

  equity(random) {
    const { hero, villain, board } = dealAny(random, 3);
    const res = equity([hero, villain], { board, mode: 'exact' });
    const e = res.players[0].equity;
    const buckets = ['Under 25%', '25% to 50%', '50% to 75%', 'Over 75%'];
    const idx = e < 0.25 ? 0 : e < 0.5 ? 1 : e < 0.75 ? 2 : 3;
    return finish(random, {
      question: 'You can see the villain’s cards. What is your chance to win by the river?',
      cards: { hero: str(hero), villain: str(villain), board: str(board) },
      explain: `Your equity: ${pct(e)} (exact, ${fmt(res.boards)} deals). You win ${pct(res.players[0].win)} of the time` +
        (res.players[0].tie > 0 ? ` and split the pot ${pct(res.players[0].tie)} of the time (a split counts as half).` : '.'),
    }, [buckets[idx], ...buckets.filter((_, i) => i !== idx)].map((label, i) => ({ label, why: i === 0 ? 'Right.' : `The exact number is ${pct(e)}.` })));
  },

  callFold(random) {
    const { hero, villain, board } = dealDraw(random, 3);
    const res = equity([hero, villain], { board, mode: 'exact' });
    const e = res.players[0].equity;
    const before = pick(random, [200, 300, 400, 600, 800, 1000]);
    const bet = Math.round((before * pick(random, [0.33, 0.5, 0.75, 1, 1.5])) / 25) * 25;
    const r = potOdds(before + bet, bet);
    const ok = e >= r.equityNeeded;
    return finish(random, {
      question: `Flop. The pot was ${fmt(before)} and he bets ${fmt(bet)}. He shows you his hand. If you call, you will see both the turn and the river. Call or fold?`,
      cards: { hero: str(hero), villain: str(villain), board: str(board) },
      explain: `You need ${pct(r.equityNeeded)} (${fmt(bet)} ÷ (${fmt(before + bet)} + ${fmt(bet)})). You have ${pct(e)} (exact). So ${ok ? 'call' : 'fold'}.`,
    }, [
      { label: ok ? 'Call' : 'Fold', why: 'Right.' },
      { label: ok ? 'Fold' : 'Call', why: `Compare: you have ${pct(e)} and need ${pct(r.equityNeeded)}.` },
    ]);
  },
};

// Any hero / villain / flop where both cards are live (no draw needed).
function dealAny(random, boardSize) {
  const deck = shuffle(random, Array.from({ length: 52 }, (_, i) => i));
  return { hero: deck.slice(0, 2), villain: deck.slice(2, 4), board: deck.slice(4, 4 + boardSize) };
}

export function makeDrill(topic, seed = 1) {
  const make = makers[topic];
  if (!make) throw new Error(`Unknown drill topic "${topic}". Topics: ${Object.keys(TOPICS).join(', ')}.`);
  const random = rng(seed);
  return { topic, topicName: TOPICS[topic], seed, cards: null, ...make(random) };
}
