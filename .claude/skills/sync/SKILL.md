---
name: sync
description: Pull new hands and sessions logged in the Holdembuddy app into md files in this repo, mark them synced, and push the coach's prep back to the app. Use when the player says sync, import from the app, or get my hands.
---

# Sync with the app

App: https://claude.ai/artifact/Xiuu1Ciw5kLCPeCKRiSN5G
Use the **ArtifactData** tool with that `url`. (Load it with ToolSearch if needed.)

## App database
| Collection / doc | What | Who writes |
|---|---|---|
| `hands/<id>` | one logged hand (see fields below) | app |
| `sessions/<id>` | one session result | app |
| `coach/prep` | `{ updatedAt, focus: { title, detail }, leaks: [{ name, seen, status, topic }], checklist: [] }` (status: open / improving / fixed; topic: potOdds / stack / outs / equity / callFold; checklist: max 3 short lines) | Claude Code |
| `quiz/<YYYY-MM-DD>` | one doc per day: `{ date, topics: { <topic>: { right, total } }, updatedAt }` | app |
| `coach/profile` | short summary of the player for the in-app coach: `{ updatedAt, style, strengths: [], leaks: [] }` | Claude Code |

Hand fields: `createdAt, date, game, format, position, stackBB, heroCards[], streets{preflop{action,amount}, flop{cards[],action,amount}, turn{...}, river{...}}, result, resultChips, villain, note, synced`.

## Steps
1. `query` `hands` with `where: [["synced", "==", false]]`. Same for `sessions`.
2. For each hand, write `hands/YYYY-MM-DD/NN-<position>-<cards>.md` from `templates/hand.md` (NN = next number for that date).
   - Copy only what the app has. Missing values = `?`. Never invent actions, sizes or pot sizes.
   - Put the app id in the front matter: `app_id: <id>`. Skip a hand if a file with that `app_id` already exists.
3. For each session, write or extend `sessions/YYYY-MM-DD.md` from `templates/session.md` and link that day's hands.
4. Mark each imported doc `update` → `{ "synced": true }`, pinned with `if_version`. Use one `batch` when there are several.
5. Commit: `Sync N hands and M sessions from the app`, then push.
6. Tell the player in 1–2 lines what was imported and offer `/review-hand`.

## Writing prep back
After a review updates `profile/player.md` or `profile/study-plan.md`, write `coach/prep` and `coach/profile`
(`set` when new, else `update` with `if_version`). Keep it short: 1 focus, max 3 leaks.
Only numbers that came from the engine; anything else is marked "to validate".
