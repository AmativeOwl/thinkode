#ifndef ZPD_H
#define ZPD_H

/* Stores attributes relating to a quiz attempt */
typedef struct Attempt
{
    char question_id[37];
    float difficulty;
    int correct;
} Attempt;

/* Stores attributes relating to a quiz question */
typedef struct Question
{
    char id[37];
    float difficulty;
} Question;

/* Stores attributes relating to a learner's state:
- capability: estimates a learner's current skill level (between 0.0 - 1.0)
used to determine the highest question difficulty they can answer (ZPD)
- attempt_count: number of attempts used to retrieve establish credibility
over current user's capability (that is, to ascertain learner's capability
with utmost certainty)
*/
typedef struct LearnerState
{
    float capability;
    int attempt_count;
} LearnerState;

void update_capability(LearnerState *state, Attempt *attempt);
float get_certainty(LearnerState *state);
float score_zpd_fit(LearnerState *state, Question *q);
Question *select_next_question(LearnerState *state, Question *pool, int pool_size);

#endif