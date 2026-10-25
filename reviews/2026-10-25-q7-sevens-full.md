# Review: Q7 makes sevens full (2026-10-25)

Hand file: `hands/2026-10-25/01-q7-sevens-full.md`

## Summary
Limped pot, 6 players. Hero (BTN) Qh 7s flops two pair on `Jh Qd 7c`, checks.
Calls a 200 bet on the turn, fills up on the river `7`, raises to 2,400, gets called by Q-T. Won 6,600.

## Street by street
- **Preflop: OK.** Q7 offsuit is weak, but 200 to see a flop with 5 players in, on the button, is fine.
- **Flop: mistake (check).** Two pair is very strong here.
  - Engine: Qh7s vs the villain's real hand QcTh = **71.87%**.
  - Engine: Qh7s vs a range `QJ+,AQ,KQ,QT,JTs,T9s,K9s` = **63.71%** (the range is my guess).
  - With 5 players, many draws (K-T, T-9, A-K) can beat you. Bet now: you get value from Q-x and J-x, and make draws pay.
  - Size idea: about 1/2 to 2/3 pot (600–800). This is a rule of thumb.
- **Turn: OK, raise was better.** Bet 200 into 1,600. Pot odds: you need **11.11%** to call (engine). Calling is easy. A raise wins more from Q-x and protects your hand.
  - Engine: vs QcTh you had **86.36%** on the turn.
- **River: good.** You made a full house. Raising the small bet was right. The villain called 2,400 with two pair.
  - A bigger raise could also get called by Q-x. Hard to know.

## Main lesson
**Bet your strong made hands in multiway pots.** Slowplaying (checking a strong hand to trick people) works best heads-up on dry boards. On a board with straight draws and 5 opponents, it gives free cards.

## Good
- Good river raise for value (value = you bet because worse hands will call).
- Did not fold a strong hand to small bets.

## To validate
- Hero starting stack (11,400?) and villain stacks — blurry.
- Exact suits of the board cards.
- Was this a cash table or a tournament?
