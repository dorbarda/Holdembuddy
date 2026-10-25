"""Exact equity with the eval7 library. Used to cross-check the JavaScript engine.

Example:
    python3 tools/equity.py AhKh QsQd --board Qh7h2c
"""

import argparse
import itertools

import eval7


def cards(text):
    clean = text.replace(" ", "").replace(",", "")
    return [eval7.Card(clean[i : i + 2]) for i in range(0, len(clean), 2)]


def range_combos(text):
    """A hand like 'AhKd' or a range like 'QQ+,AKs' -> list of (card, card)."""
    clean = text.replace(" ", "")
    if len(clean) == 4 and clean[1] in "shdc" and clean[3] in "shdc":
        a, b = cards(clean)
        return [(a, b)]
    return [hand for hand, _weight in eval7.HandRange(text).hands]


def exact_equity(players, board=""):
    """Every combo set x every board. Returns list of dicts: win, tie, equity (fractions)."""
    board_cards = cards(board) if board else []
    combo_lists = [range_combos(p) for p in players]
    n = len(players)
    win = [0.0] * n
    tie = [0.0] * n
    eq = [0.0] * n
    deals = 0
    for hands in itertools.product(*combo_lists):
        used = [c for h in hands for c in h] + board_cards
        if len(set(used)) != len(used):
            continue
        deck = [c for c in eval7.Deck().cards if c not in used]
        for extra in itertools.combinations(deck, 5 - len(board_cards)):
            full = board_cards + list(extra)
            scores = [eval7.evaluate(list(h) + full) for h in hands]
            best = max(scores)
            k = scores.count(best)
            for p, s in enumerate(scores):
                if s == best:
                    if k == 1:
                        win[p] += 1
                    else:
                        tie[p] += 1
                    eq[p] += 1 / k
            deals += 1
    return [{"win": win[p] / deals, "tie": tie[p] / deals, "equity": eq[p] / deals} for p in range(n)], deals


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("players", nargs="+")
    ap.add_argument("--board", default="")
    args = ap.parse_args()
    res, deals = exact_equity(args.players, args.board)
    for name, r in zip(args.players, res):
        print(f"{name:16} equity {r['equity']:.2%}  (win {r['win']:.2%}, tie {r['tie']:.2%})")
    print(f"Exact: {deals:,} deals.")


def outs_count(hero, villain, board):
    """Cards on the next street that put hero strictly ahead, when hero is behind now."""
    h, v, b = cards(hero), cards(villain), cards(board)
    if eval7.evaluate(h + b) >= eval7.evaluate(v + b):
        return 0
    used = h + v + b
    return sum(
        1
        for c in eval7.Deck().cards
        if c not in used and eval7.evaluate(h + b + [c]) > eval7.evaluate(v + b + [c])
    )
