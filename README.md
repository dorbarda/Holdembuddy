# Holdembuddy

A personal Texas Hold'em coach: logs your hands, reviews them, teaches the math, and prepares you for the next session.

## Parts
- **App** (coming in phase 4): private claude.ai web app for phone and computer. Ask Coach, Odds Lab, Math School, Log, Prep.
- **This repo**: the coach office. Hand records, reviews, your profile, and the code.

## Use it now
Open Claude Code in this repo and type:
- `/log-hand`: tell a hand from your last game.
- `/review-hand`: get a review of a logged hand.

## Odds engine
```
node app/engine/cli.js equity AhKh QsQd
node app/engine/cli.js equity AhKh "QQ+,AKs" --board Qh7h2c
node app/engine/cli.js potodds --pot 300 --call 100
node app/engine/cli.js outs AhKh QsQd --board Qh7h2c
node app/engine/cli.js stack --stack 4500 --sb 100 --bb 200 --ante 25 --players 9
```

## Tests
```
node --test app/engine/*.test.js
pip install -r tools/requirements.txt && pytest tools
```

## Roadmap
1. Foundation: rules, folders, templates, `/log-hand`, `/review-hand` ✅
2. Odds engine + Python cross-check ✅
3. Design: mockup ready for your review (`design/design.md`)
4. App v1: Odds Lab, Log, Ask Coach, `/sync`
5. App v2: Math School, Prep, `/review-session`, `/drill`, `/progress`
6. Online: PokerStars play money, hand history import, stats
7. Optional: screen video → frames
8. Later: bankroll tracker for real money
