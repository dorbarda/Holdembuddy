---
name: review-hand
description: Review one logged poker hand street by street, with exact math from the odds engine, and update the player profile. Use when the player asks to review, analyze or check a hand.
---

# Review a hand

## Before you start
1. Find the hand file (ask which one if unclear; default = the newest in `hands/`).
2. Read `profile/player.md` and `profile/study-plan.md`.
3. If key facts are missing (stacks, positions, sizes), ask before reviewing.

## Get the numbers (never guess)
Use the engine for every number. Examples:
- Stack in big blinds: `node app/engine/cli.js stack --stack 4500 --sb 100 --bb 200 --ante 25 --players 9`
- Pot odds at a decision: `node app/engine/cli.js potodds --pot 900 --call 300`
- Equity vs a likely range: `node app/engine/cli.js equity AhKd "TT+,AQs+,AKo" --board Qh7h2c`
- Outs vs a likely hand: `node app/engine/cli.js outs AhKd QsQc --board Qh7h2c`

The villain's range is a guess: say so, and write the range you used.
If a number can't come from the engine (e.g. ICM, push/fold charts), write **"to validate"** and ask if the player wants to check it.

## Write the review
Save to `reviews/YYYY-MM-DD-<hand-file-name>.md`:

```
# Review: <hand name>

## Short answer
<1–2 lines: the main mistake or "well played".>

## Street by street
### Preflop
- You did: ...
- Better / also OK: ...
- Why: ... (numbers from the engine)
(same for flop, turn, river, only the streets that were played)

## The math
| Spot | Number | How we got it |
|---|---|---|

## One lesson
<One sentence to remember.>

## Leak check
<New leak, or a repeat of an existing one, or none.>
```

## After the review
1. Show the player the short answer, the one lesson, and the file path. Keep the chat short.
2. Update `profile/player.md`: add or update the leak row (with the hand file), strengths, "Last update" date.
3. If a leak repeats 3+ times, suggest adding it to the current focus in `profile/study-plan.md`. Ask first.
