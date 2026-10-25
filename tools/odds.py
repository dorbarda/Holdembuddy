"""Simple poker math in Python, written separately from the JS engine to cross-check it."""


def pot_odds(pot, call):
    """pot = chips in the middle including the bet you face; call = chips you add."""
    return {"ratio": pot / call, "equityNeeded": call / (pot + call)}


def stack_info(stack, sb, bb, ante=0, players=9, bb_ante=False):
    antes = ante if bb_ante else ante * players
    orbit = sb + bb + antes
    return {"bigBlinds": stack / bb, "orbitCost": orbit, "mRatio": stack / orbit}
