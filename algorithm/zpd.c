#include <stdio.h>
#include <stdlib.h>
#include "zpd.h"

#define K 5
#define LEARNING_RATE 0.1
#define IDEAL_DIFF_MULT 1.1f

void update_capability(LearnerState *state, Attempt *attempt);
float get_certainty(LearnerState *state);
float score_zpd_fit(LearnerState *state, Question *q);
Question *select_next_question(LearnerState *state, Question *pool, int pool_size);

/*
Updates the learner's capability estimate based on a single attempt.

The update magnitude is scaled by two factors:
  1. Question difficulty: a correct answer on a hard question (high difficulty) produces
    a larger capability increase than an easy one. Conversely, an incorrect answer on an
    easy question (low difficulty, so 1 - difficulty is high) produces a large decrease.
  2. Learning rate decay: certainty is derived from attempt_count and approaches 1.0 as
    more attempts are observed. Multiplying by (1 - certainty) ensures early attempts shift
    shift capability more dramatically while later attempts produce smaller, more stable
    updates.

Formula:
  correct: capability += LEARNING_RATE * difficulty * (1 - certainty)
  incorrect: capability -= LEARNING_RATE * (1 - difficulty) * (1 - certainty)
*/
void update_capability(LearnerState *state, Attempt *attempt)
{
    float certainty = get_certainty(state);
    if (attempt->correct)
        state->capability += LEARNING_RATE * attempt->difficulty * (1 - certainty);
    else
        state->capability -= LEARNING_RATE * (1 - attempt->difficulty) * (1 - certainty);

    state->attempt_count++;
}

/*
Returns how much confidence to place in the current capability estimate,
based on the number of attempts observed so far. Approaches 1.0 as
attempt_count grows, but never reaches it. A higher K means more attempts
are needed before certainty rises significantly (slower convergence).

See: y = x / (x + k), k = [fixed value] to observe graphical reasoning on Desmos.
*/
float get_certainty(LearnerState *state)
{
    return (float)state->attempt_count / (state->attempt_count + K);
}

/*
Scores how well a question fits the learner's current Zone of Proximal Development (ZPD).

A perfect fit occurs when the question difficulty is slightly above the learner's current
capability and challenging enough to promote growth but not so far beyond reach that it
becomes discouraging. The ideal difficulty is defined as capability * IDEAL_DIFF_MULT.

The score is calculated as 1 - distance from the ideal, constrained to a minimum of 0:
  score = max(0, 1 - fabs(q->difficulty - ideal))

A score of 1.0 indicates a perfect ZPD fit. The score decreases as the question
becomes either too easy or too difficult relative to the learner's current capability.
*/
float score_zpd_fit(LearnerState *state, Question *q)
{
    float ideal = state->capability * IDEAL_DIFF_MULT;
    float distance = fabs(q->difficulty - ideal);
    float score = 1.0f - distance;

    if (score < 0)
        score = 0;

    return score;
}

Question *select_next_question(LearnerState *state, Question *pool, int pool_size)
{
}