Based on the readings in ALGORITHM_NOTES.md:

Goal:

To create a new study pattern (in the spirit of Pomodoro or spaced repetition, but enhanced) that
decides three things for the learner:
  - What to study: the problem that best fits their ZPD
  - When to come back to it: once they have started to forget it
  - How long to study for: when a session should pause or end

The current algorithm only partly covers the first of these. It estimates a single capability
value and selects the question closest to capability + ZPD_STRETCH.

1. Switch the capability update to an IRT-style success probability

Instead of only scoring an attempt after it happens, IRT predicts the probability that the learner
will solve a problem before they attempt it, based on their ability and the problem's difficulty.
The capability update is then scaled by how surprising the result was: a strong learner solving an
easy problem barely changes their estimate, while failing it changes it a lot. Producing a
probability is also what allows this to be combined with FSRS in step 3.

Design note: capability will become per-topic in step 4, so the structures written here should
allow for that from the start to avoid rework.

2. Add per-problem memory state from FSRS (e.g. stability, last reviewed)

Each problem keeps its own memory state so that forgetting can be modelled over time, which lets
us optimise when problems should be reviewed. This replaces the lifetime seen_count, which never
decays.

FSRS requires a grade for each review (Again / Hard / Good / Easy) rather than a simple
correct/incorrect. The grade will be derived from signals the app already has:
  - number of hints used
  - number of attempts
  - time taken
  - Gemini's feedback on the attempt

FSRS's published default parameters will be used initially (cold start), since a single learner
will not have enough review history to tune them.

3. Combine both into a single predicted-success number and select on a target range

Each problem receives one number: the probability that the learner can solve it right now. The
next problem is the one whose predicted success sits closest to a target range (e.g. 70-85%), which
is the ZPD expressed as a probability: hard enough to promote growth but not discouraging.

Key insight: as time passes and the learner forgets a problem, its predicted success falls until it
drops back into the target range, at which point it is selected for review. New problems and
reviews therefore compete on the same terms, and reviews are scheduled because they have become
useful again rather than because a timer fired.

Open questions:
  - How exactly are the IRT and FSRS values combined (e.g. multiplied, or one used alone)?
  - A new problem has no FSRS history, so what is its memory value?
  - What should the target range be, and should it change as certainty grows?

4. Add topic/pattern tags and per-topic ability

Problems are categorised by topic and pattern (e.g. arrays, two pointers, dynamic programming), and
capability is tracked per topic. A learner can be strong at one and weak at another, which a single
global value blurs.

This enables reviewing the pattern, not the problem: re-solving the same problem may only test
whether the learner remembers its answer. Instead, when a pattern's memory decays, the learner is
given a new problem that uses the same pattern, which better measures transferable skill.

5. Evaluate the model

Before building on top of the model, we need to know that it works:
  - Calibration: do predicted success rates match what actually happens? If the model predicts
    75%, learners should solve roughly 75% of those problems.
  - Simulation: extend the simulation in test_zpd.c with simulated learners of different abilities
    and forgetting rates, and check that capability converges and reviews are scheduled sensibly.

6. Add the session layer

Using the model established above, create learning "sessions" whose length adapts to the learner
rather than following a fixed timer:
  - Pause or end the session when actual success keeps falling below predicted success, or when
    time per attempt keeps rising (signs of fatigue).
  - Interleave reviews and new problems within a session.
  - End the session when the expected learning gain per minute becomes low.

The current readings model memory and ability, not attention or fatigue, so this step needs further
reading first:
  - Bjork's research on desirable difficulties
  - Research on interleaved practice
  - Cognitive load theory

Integration with the app:

Each step needs data that the database does not yet store, including attempt grades, last-reviewed
times, per-problem memory state, topic tags and per-topic ability. The schema changes and the way
the C code runs alongside the app (e.g. compiled to WebAssembly) will be planned separately.
