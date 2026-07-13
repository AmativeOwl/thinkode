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

float get_certainty(LearnerState *state)
{
}

float score_zpd_fit(LearnerState *state, Question *q)
{
}

Question *select_next_question(LearnerState *state, Question *pool, int pool_size)
{
}