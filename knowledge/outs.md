# Outs

Outs = cards that make your hand the best hand. Count only clean outs (some cards help the villain more).

- Flush draw: usually 9 outs. Open-ended straight draw: usually 8 outs.
- **Shortcut (not exact):** outs × 2 ≈ % on the next card; outs × 4 ≈ % from flop to river.

| Draw | Exact chance | Shortcut |
|---|---|---|
| 9 outs, flop → turn (47 unseen) | 19.15% | 18% |
| 9 outs, flop → river | 34.97% | 36% |
| 8 outs, flop → river | 31.45% | 32% |
| 9 outs, turn → river (46 unseen) | 19.57% | 18% |

Exact numbers from `drawChance()` in `app/engine/odds.js` (cards you can't see are treated as unknown).
