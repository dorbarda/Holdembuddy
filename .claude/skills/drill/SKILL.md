---
name: drill
description: Run a short poker math quiz in the chat (pot odds, stack size, outs, equity, call or fold), with answers calculated by the engine and topics chosen from the player's leaks. Use when the player asks for a drill, quiz, practice or test.
---

# Drill in the chat

1. Pick topics:
   - If the player names one, use it.
   - Else use the leaks in `profile/player.md` (a leak about calling = `callFold` and `potOdds`, short stack = `stack`, draws = `outs`, hand strength = `equity`).
   - Else mix all topics.
2. For each question (default 5), run:
   `node app/engine/cli.js drill <topic>` (topics: potOdds, stack, outs, equity, callFold).
   The output ends with `Answer:` and the explanation. **Do not show the answer** until the player replies.
3. Show the question: cards (if any), the question, and the options A, B, C, D. Keep the seed so you can show the same question again.
4. After the reply: say right or not, show the explanation from the CLI output (it has the exact numbers), and add one short tip if they were wrong.
5. At the end: the score (for example 4 / 5) and which topic to practice next.
6. Optional: add the score to `profile/study-plan.md` under the topic, with the date.

Never make up a question or an answer yourself. Every number comes from the CLI.
