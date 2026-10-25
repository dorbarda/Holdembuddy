---
name: log-hand
description: Interview the player about one poker hand they played and save it as a hand file. Use when the player says they want to log, record, save or tell a hand.
---

# Log a hand

Goal: turn the player's story into a clean hand file, fast and without mistakes.

## Steps
1. If the player already told the hand, extract what you can first. Only ask for what is missing.
2. Ask in **small groups** (max 3 questions at a time), in simple English:
   - Game: home or online? Tournament, Sit & Go or cash? Date?
   - Table: how many players, blinds/ante, tournament stage (early, middle, bubble, final table)?
   - Hero: position, stack, cards.
   - Villains: position, stack, any read.
   - Actions: preflop, flop, turn, river, with bet sizes. Board cards.
   - Result and showdown cards.
   - "What were you thinking? Where were you unsure?"
3. If something doesn't add up (pot size, stack after a bet, a card used twice), point to it and ask. Do not fix it silently.
4. Fill `templates/hand.md` and save to `hands/YYYY-MM-DD/NN-short-name.md` (NN = next number for that day).
   - Write pot sizes only when they can be calculated from the actions. Otherwise write "to validate".
   - Unknown values: write `?`, never invent.
5. Show the player a short summary (3–5 lines) and ask: "Is this right?"
6. After they confirm, offer: "Do you want a review now? (`/review-hand`)"

## Card format
Rank + suit: `Ah Kd Ts 9c`. Ten is `T`. Suits: s h d c.
If the player doesn't remember suits, ask only if it matters (flush possible). Otherwise use different suits and add a note "suits not remembered".
