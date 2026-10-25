"""Cross-check the JavaScript odds engine against eval7 (an independent C evaluator)."""

import json
import pathlib
import random
import subprocess

import eval7
import pytest

from equity import exact_equity
from odds import pot_odds, stack_info

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLI = ROOT / "app" / "engine" / "cli.js"

# eval7 names -> JS names
CATEGORY = {
    "High Card": "High card",
    "Pair": "Pair",
    "Two Pair": "Two pair",
    "Trips": "Three of a kind",
    "Straight": "Straight",
    "Flush": "Flush",
    "Full House": "Full house",
    "Quads": "Four of a kind",
    "Straight Flush": "Straight flush",
}


def js(*args, stdin=None):
    out = subprocess.run(
        ["node", str(CLI), *args], input=stdin, capture_output=True, text=True, check=True
    )
    return json.loads(out.stdout)


def test_evaluator_matches_eval7_on_random_hands():
    rng = random.Random(42)
    deck = [str(c) for c in eval7.Deck().cards]
    hands = [rng.sample(deck, rng.choice([5, 6, 7])) for _ in range(20000)]
    js_res = js("rank-batch", stdin="\n".join("".join(h) for h in hands))
    py_scores = [eval7.evaluate([eval7.Card(c) for c in h]) for h in hands]

    for h, j, p in zip(hands, js_res, py_scores):
        assert j["category"] == CATEGORY[eval7.handtype(p)], h

    # Same winner for every pair of neighbours.
    for i in range(len(hands) - 1):
        js_cmp = (js_res[i]["score"] > js_res[i + 1]["score"]) - (js_res[i]["score"] < js_res[i + 1]["score"])
        py_cmp = (py_scores[i] > py_scores[i + 1]) - (py_scores[i] < py_scores[i + 1])
        assert js_cmp == py_cmp, (hands[i], hands[i + 1])


EQUITY_CASES = [
    (["AhKh", "QsQd"], ""),  # preflop, ~2s in Python
    (["Ac7c", "8d8h"], ""),
    (["AhKh", "QsQd"], "Qh7h2c"),
    (["Js Ts", "AdKc"], "9h8c2d"),
    (["AsAd", "KsKd", "7c6c"], "5c4h2d"),
    (["AhKd", "QQ+,AKs"], "Qh7h2c"),  # hand vs range
    (["9s9h", "AK,AQs"], "Th6d3c4s"),
]


@pytest.mark.parametrize("players,board", EQUITY_CASES)
def test_equity_matches_eval7(players, board):
    args = ["equity", *players, "--mode", "exact", "--json"]
    if board:
        args += ["--board", board]
    j = js(*args)
    py, deals = exact_equity(players, board)
    assert j["boards"] == deals
    for jp, pp in zip(j["players"], py):
        for key in ("win", "tie", "equity"):
            assert jp[key] == pytest.approx(pp[key], abs=1e-12), (players, board, key)


def test_pot_odds_and_stack_match():
    for pot, call in [(300, 100), (1250, 400), (75, 75)]:
        j = js("potodds", "--pot", str(pot), "--call", str(call), "--json")
        assert j == pytest.approx(pot_odds(pot, call))
    j = js("stack", "--stack", "4500", "--sb", "100", "--bb", "200", "--ante", "25", "--players", "9", "--json")
    assert j == pytest.approx(stack_info(4500, 100, 200, 25, 9))
