---
name: review-session
description: Review a whole poker session (a home game or online tournament) - sync from the app, review the key hands with exact engine math, find patterns, update the player profile, and write new prep to the app. Use when the player says review my session, review my game, or how did I play tonight.
---

# Review a session

## 1. Get the data
1. Run the `/sync` steps first (`.claude/skills/sync/SKILL.md`), so new app hands and sessions are in `hands/` and `sessions/`.
2. Pick the session: the newest in `sessions/`, unless the player names one. If there is no session file but there are hands for that date, use the hands and ask for the result (finish place, players) in one short question.
3. Read `profile/player.md`, `profile/study-plan.md`, and earlier `reviews/` for this player.

## 2. Review
- Choose the **key hands** (max 5): big pots, all-ins, hands the player marked as unsure, and hands that repeat a known leak.
- For each key hand: what happened, the better option, the math, one lesson. 3 to 6 lines each.
- Every number comes from the engine CLI (see `CLAUDE.md`). Ranges you guess: say which range you used.
- Numbers you can't calculate (ICM, push/fold charts): write "to validate".
- Look for **patterns** across the hands (for example: "called too often from the big blind in 3 of 7 hands"). Count them exactly from the hand files.

## 3. Write
`reviews/YYYY-MM-DD-session.md`:
```
# Session review: YYYY-MM-DD

## Short answer
<2 lines: how it went and the main thing to fix.>

## Result
<format, players, finish, prize, from the session file>

## Key hands
### 1. <hand file name>
...

## Patterns
- <pattern> (seen in N of M hands)

## What went well
- ...

## Focus for next time
<one thing>
```

## 4. Update the coach
1. `profile/player.md`: leaks table (add or update rows, with hand files), strengths, style notes, "Last update".
2. `profile/study-plan.md`: current focus (max 3). Ask before changing the focus.
3. App prep (ArtifactData, app URL in `CLAUDE.md`), `coach/prep`:
   `{ updatedAt, focus: { title, detail }, leaks: [{ name, seen, status, topic }], checklist: [max 3 short lines] }`
   - `topic` = the drill topic that trains the leak: `potOdds`, `stack`, `outs`, `equity`, `callFold`, or leave it out.
   - `seen` = exact count from hand files.
4. `coach/profile`: `{ updatedAt, style, strengths: [], leaks: [] }` (short).
5. Commit `Review session YYYY-MM-DD` and push.

## 5. Tell the player
In the chat: the short answer, the focus for next time, and that the app's Prep tab is updated. Keep it short.
