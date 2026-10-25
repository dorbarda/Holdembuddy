---
name: progress
description: Write a progress report for the poker player - results over time, leaks open/improving/fixed, and quiz scores per topic, using only counted data. Use when the player asks how they are doing, for progress, stats, or improvement.
---

# Progress report

## Data (count, don't estimate)
1. `sessions/*.md` front matter: date, format, buy_in, players, finish, prize.
2. `hands/**/*.md`: count hands per month, per position, per result.
3. `profile/player.md`: leaks and their status; `reviews/`: when each leak was seen.
4. App quiz scores: ArtifactData `list` of collection `quiz` (app URL in `CLAUDE.md`). Each doc = one day: `{ date, topics: { <topic>: { right, total } } }`.

## Write `reviews/progress-YYYY-MM-DD.md`
```
# Progress: YYYY-MM-DD

## Short answer
<2 lines in simple English>

## Results
| Period | Sessions | Avg finish (place / players) | In the money | Prize − buy-ins |

## Leaks
| Leak | Status | First seen | Last seen | Times seen |

## Quiz scores
| Topic | Last 7 days | Before | Change |

## Next focus
<one thing>
```
- Every number is a count or a simple sum/average of the data. Show how a number was made if it is not obvious.
- If there is too little data (for example fewer than 3 sessions), say so instead of drawing a trend.
- ROI and "in the money %" only if the data has buy-ins and prizes.

Commit `Progress report YYYY-MM-DD` and push. In the chat: the short answer and the next focus.
