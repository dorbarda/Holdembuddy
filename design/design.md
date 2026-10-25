# Holdembuddy design

**Status: draft, waiting for approval.**
Mockup (clickable): https://claude.ai/artifact/A6f3PtNtj9PHe36rJD8tJ5

## Look and feel
- Dark mode first (poker is often played at night, in low light). Light mode also supported.
- Calm and clear, like a quiet card room. No felt textures, no casino look.
- One accent: **chip gold** = you / main action. **Blue** = villain.
- Numbers are big and easy to read.

## Colors
| Token | Dark | Light | Use |
|---|---|---|---|
| ground | `#0E1311` | `#F6F5F0` | page background |
| surface | `#161D1A` | `#FFFFFF` | cards, panels |
| line | `#2C3832` | `#DEDCD3` | borders |
| text | `#EEF2EF` | `#141A17` | main text |
| muted | `#9AA8A1` | `#59655F` | labels, help text |
| gold | `#F2B544` | `#F2B544` (fill) / `#8A5A00` (text) | you, main button, "to validate" |
| gold ink | `#1A1305` | `#1A1305` | text on gold |
| blue | `#5B8FE6` / `#8DB8FF` (text) | (to define) | villain |
| good | `#8FD4AE` | `#1F6B43` | engine badge, "improving" |

## Type
- **Manrope** for all words (700–800 for titles, 15–17 px body, never under 12 px).
- **IBM Plex Mono** for every number, so digits line up.

## Cards
- White face `#F7F7F4`, rank on top, suit symbol below.
- **4-color deck by default**: spades `#1B1F1D`, hearts `#D92D3A`, diamonds `#2563EB`, clubs `#15803D`.
- Classic 2-color deck as a setting.
- The suit symbol is always shown, so color is never the only clue.

## Layout
- **Phone** (390 px wide): tab bar at the bottom with 5 tabs: Prep · Odds · Learn · Log · Coach.
- **Computer**: side menu on the left, content up to 1040 px wide, two columns (inputs | results).
- All buttons at least 44 px tall. Main actions are 56 px tall and full width on phone.

## Trust badges
- Green badge `Engine · exact · N deals`: the number came from the odds engine.
- Gold badge `To validate`: the number is not checked yet. The coach asks the player.

## Screens in the mockup
1. **Prep** (home): today's focus, top 3 leaks, warm-up button, last session.
2. **Odds Lab**: you vs villain, board, equity bar, outs, pot odds. Tap Preflop / Flop to switch.
3. **Log a hand**: position, stack in BB, cards, action, result, note, Save.
4. **Ask Coach**: chat. Answers show engine badges and "to validate" when needed.
5. **Math School quiz**: one question, tap an answer, see the math.
6. **Prep in light mode**.
7. **Computer: Odds Lab** (hand vs range).
8. **Style guide**.

## Target flows
- Log a hand in **under 30 seconds** (tap position → cards → action → result → Save).
- Check odds in **3 taps** (your cards → villain → see result).

## Numbers used in the mockup (all from the engine)
| Spot | Result |
|---|---|
| AhKh vs QsQd, preflop | 46.21% vs 53.79% (exact, 1,712,304 deals) |
| AhKh vs QsQd, flop Qh 7h 2c | 25.56% vs 74.44% (exact, 990 deals) |
| Outs on that flop | 8, so 8/45 = 17.78% on the next card |
| Call 100 into a pot of 300 | need 25.00% |
| AhKh vs "TT+, AJs+, AQo+", flop Qh 7h 2c | 54.05% vs 45.95% (exact, 41,580 deals) |

The leaks on the Prep screen are **example data**, not real stats.

## Open questions for review
- Dark by default, or follow the phone's setting?
- 4-color deck by default: OK?
- Tab names: Prep · Odds · Learn · Log · Coach. OK?
