#ifndef ZDP_H
#define ZDP_H

typedef struct Attempt
{
    int question_id;
    float difficulty;
    int correct;
} Attempt;

typedef struct Question
{
    int id;
    float difficulty;
} Question;

typedef struct LearnerState
{
    float capability;
    int attempt_count;
} LearnerState;

#endif