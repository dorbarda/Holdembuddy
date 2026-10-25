#!/usr/bin/env node
// Command line for the odds engine. Run with no arguments for help.

import { equity } from './equity.js';
import { potOdds, stackInfo, outs } from './odds.js';
import { makeDrill, TOPICS } from './drills.js';
import { evaluate, categoryName } from './evaluator.js';
import { parseCards, cardsToString } from './cards.js';

const HELP = `Holdembuddy odds engine

  equity <player1> <player2> [...] [--board Qh7h2c] [--dead 2s] [--mode exact|sim] [--runs N] [--seed N] [--json]
      player = a hand like AhKd or a range like "QQ+,AKs,AQo+"
  potodds --pot <chips in middle incl. bet> --call <chips to call> [--json]
  stack --stack <chips> --sb <sb> --bb <bb> [--ante <ante>] [--players <n>] [--bbante] [--json]
  outs <hero> <villain> --board <3 or 4 cards> [--json]
  drill <topic> [--seed N] [--json]
      topic = ${Object.keys(TOPICS).join(' | ')}. Prints the question, options and (last) the answer.
  rank-batch     (reads one hand per line from stdin, prints scores; used by tests)
`;

function parseArgs(argv) {
  const pos = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[key] = true;
      else flags[key] = argv[++i];
    } else pos.push(a);
  }
  return { pos, flags };
}

const pct = (x) => `${(x * 100).toFixed(2)}%`;
const num = (x, d = 2) => Number(x.toFixed(d)).toString();

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const { pos, flags } = parseArgs(rest);
  const json = flags.json === true;
  const out = (obj, text) => console.log(json ? JSON.stringify(obj) : text);

  switch (cmd) {
    case 'equity': {
      const res = equity(pos, {
        board: flags.board,
        dead: flags.dead,
        mode: flags.mode,
        runs: flags.runs ? Number(flags.runs) : undefined,
        seed: flags.seed ? Number(flags.seed) : undefined,
      });
      const lines = res.players.map(
        (p, i) =>
          `  ${pos[i].padEnd(16)} equity ${pct(p.equity).padStart(7)}  (win ${pct(p.win)}, tie ${pct(p.tie)})` +
          (p.margin != null ? `  ± ${pct(p.margin)}` : ''),
      );
      const how =
        res.mode === 'exact'
          ? `Exact: counted all ${res.boards.toLocaleString('en-US')} deals.`
          : `Simulation: ${res.runs.toLocaleString('en-US')} random deals, 95% margin shown (±).`;
      const board = flags.board ? ` Board: ${cardsToString(parseCards(flags.board))}.` : ' Preflop.';
      out(res, `${lines.join('\n')}\n${how}${board}`);
      break;
    }
    case 'potodds': {
      const res = potOdds(Number(flags.pot), Number(flags.call));
      out(
        res,
        `Pot odds ${num(res.ratio)} : 1. You need ${pct(res.equityNeeded)} equity to call.\n` +
          `(call ${flags.call} / (pot ${flags.pot} + call ${flags.call}))`,
      );
      break;
    }
    case 'stack': {
      const res = stackInfo({
        stack: Number(flags.stack),
        sb: Number(flags.sb),
        bb: Number(flags.bb),
        ante: flags.ante ? Number(flags.ante) : 0,
        players: flags.players ? Number(flags.players) : 9,
        bbAnte: flags.bbante === true,
      });
      out(res, `Stack: ${num(res.bigBlinds, 1)} big blinds. One orbit costs ${res.orbitCost}. M-ratio: ${num(res.mRatio, 1)}.`);
      break;
    }
    case 'outs': {
      const res = outs(pos[0], pos[1], flags.board);
      const text = !res.behind
        ? 'Hero is not behind right now, so there are no outs to count.'
        : `${res.outs.length} outs: ${cardsToString(res.outs) || '-'}\n` +
          (res.tieOuts.length ? `Split-pot cards: ${cardsToString(res.tieOuts)}\n` : '') +
          `Chance to hit on the next card: ${res.outs.length}/${res.unseen} = ${pct(res.nextCardChance)}`;
      out({ ...res, outs: cardsToString(res.outs), tieOuts: cardsToString(res.tieOuts) }, text);
      break;
    }
    case 'drill': {
      const seed = flags.seed ? Number(flags.seed) : Math.floor(Math.random() * 1e9);
      const d = makeDrill(pos[0], seed);
      const cards = d.cards
        ? `You: ${d.cards.hero.join(' ')} | Villain: ${d.cards.villain.join(' ')} | Board: ${d.cards.board.join(' ')}\n`
        : '';
      const opts = d.options.map((o, i) => `  ${String.fromCharCode(65 + i)}) ${o.label}`).join('\n');
      out(d, `[${d.topicName}] (seed ${seed})\n${cards}${d.question}\n${opts}\n\nAnswer: ${d.answer}\n${d.explain}`);
      break;
    }
    case 'rank-batch': {
      const input = await new Promise((resolve) => {
        let data = '';
        process.stdin.on('data', (d) => (data += d));
        process.stdin.on('end', () => resolve(data));
      });
      const lines = input.split('\n').filter((l) => l.trim());
      const scores = lines.map((l) => {
        const s = evaluate(parseCards(l));
        return { score: s, category: categoryName(s) };
      });
      console.log(JSON.stringify(scores));
      break;
    }
    default:
      console.log(HELP);
  }
}

main().catch((e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});
