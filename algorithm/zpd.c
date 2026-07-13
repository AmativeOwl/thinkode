#include <stdio.h>
#include <stdlib.h>
#include "zdp_score.h"

#define K 5

void update_capability(LearnerState *state, Attempt *attempt);
float get_certainty(LearnerState *state);
float score_zpd_fit(LearnerState *state, Question *q);
Question *select_next_question(LearnerState *state, Question *pool, int pool_size);

void update_capability(LearnerState *state, Attempt *attempt)
{
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

float score_zpd_fit(LearnerState *state, Question *q)
{
}

Question *select_next_question(LearnerState *state, Question *pool, int pool_size)
{
}