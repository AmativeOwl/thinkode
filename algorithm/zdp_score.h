#ifndef ZDP_H
#define ZDP_H

typedef struct Attempt
{
    char question_id[37];
    float difficulty;
    int correct;
} Attempt;

typedef struct Question
{
    char id[37];
    float difficulty;
} Question;

typedef struct LearnerState
{
    float capability;
    int attempt_count;
} LearnerState;

#endif