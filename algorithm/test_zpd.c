#include <stdio.h>
#include <string.h>
#include <math.h>
#include "zpd.h"

static int failures = 0;

/* Define the CHECK macro to simplify test assertions */
#define CHECK(cond, msg)                         \
    do                                           \
    {                                            \
        if (cond)                                \
            printf("  PASS  %s\n", msg);         \
        else                                     \
        {                                        \
            printf("  FAIL  %s\n", msg);         \
            failures++;                          \
        }                                        \
    } while (0)

/* Define a helper function to create a question with a given id and difficulty */
static Question make_question(const char *id, float difficulty)
{
    Question q;
    strncpy(q.id, id, ID_LENGTH - 1);
    q.id[ID_LENGTH - 1] = '\0';
    q.difficulty = difficulty;
    q.seen_count = 0;
    return q;
}

/* Define a helper function to retrieve the certainty of a learner state */
static void test_certainty(void)
{
    printf("get_certainty\n");
    LearnerState s = {0.5f, 0};
    CHECK(get_certainty(&s) == 0.0f, "certainty is 0 with no attempts");

    s.attempt_count = 1000;
    float c = get_certainty(&s);
    CHECK(c > 0.99f && c < 1.0f, "certainty approaches but never reaches 1");
}

/* Define a test function to check that correct answers raise capability, incorrect answers lower it and each attempt is counted */
static void test_update_capability(void)
{
    printf("update_capability\n");
    LearnerState s = {0.5f, 0};
    Attempt a = {"q1", 0.8f, 1};

    update_capability(&s, &a);
    CHECK(s.capability > 0.5f, "correct answer raises capability");
    CHECK(s.attempt_count == 1, "attempt_count increments");

    float before = s.capability;
    a.correct = 0;
    update_capability(&s, &a);
    CHECK(s.capability < before, "incorrect answer lowers capability");
}

/* Define a test function to check that questions at the ideal difficulty score highest and scores never go below 0 */
static void test_score_zpd_fit(void)
{
    printf("score_zpd_fit\n");
    LearnerState s = {0.5f, 0};
    Question ideal = make_question("ideal", 0.6f); /* Capability 0.5 + ZPD_STRETCH 0.1 */
    Question far = make_question("far", 1.0f);

    CHECK(fabsf(score_zpd_fit(&s, &ideal) - 1.0f) < 1e-5f, "ideal difficulty scores ~1.0");
    CHECK(score_zpd_fit(&s, &far) < score_zpd_fit(&s, &ideal), "distant question scores lower");
    CHECK(score_zpd_fit(&s, &far) >= 0.0f, "score never negative");
}

/* Define a test function to check that the best-fitting question is selected, heavily-seen questions are penalised and an empty pool returns NULL */
static void test_select_next_question(void)
{
    printf("select_next_question\n");
    LearnerState s = {0.5f, 0};

    CHECK(select_next_question(&s, NULL, 0) == NULL, "empty pool returns NULL");

    Question pool[3] = {
        make_question("easy", 0.1f),
        make_question("ideal", 0.6f),
        make_question("hard", 0.95f),
    };
    Question *q = select_next_question(&s, pool, 3);
    CHECK(q == &pool[1], "picks the best ZPD fit");
    CHECK(pool[1].seen_count == 1, "selected question's seen_count increments");

    /* Two equally good questions: the heavily-seen one should lose to the fresh one */
    Question tie[2] = {make_question("a", 0.6f), make_question("b", 0.6f)};
    tie[0].seen_count = 3;
    q = select_next_question(&s, tie, 2);
    CHECK(q == &tie[1], "heavily-seen question loses to an equally good fresh one");
}

/* Define a simulation of a learner who answers every question correctly, printing how capability and certainty evolve */
static void simulate(void)
{
    printf("\nsimulation: always-correct learner\n");
    LearnerState s = {0.3f, 0};
    Question pool[5] = {
        make_question("q1", 0.2f),
        make_question("q2", 0.4f),
        make_question("q3", 0.6f),
        make_question("q4", 0.8f),
        make_question("q5", 1.0f),
    };

    for (int i = 0; i < 10; i++)
    {
        Question *q = select_next_question(&s, pool, 5);
        Attempt a;
        strcpy(a.question_id, q->id);
        a.difficulty = q->difficulty;
        a.correct = 1;
        update_capability(&s, &a);
        printf("  #%2d  served %s (%.1f)  capability=%.4f  certainty=%.3f\n",
               i + 1, q->id, q->difficulty, s.capability, get_certainty(&s));
    }
}

/* Define the entry point that runs every test and the simulation, returning a non-zero exit code if any test fails */
int main(void)
{
    test_certainty();
    test_update_capability();
    test_score_zpd_fit();
    test_select_next_question();
    simulate();

    printf("\n%s (%d failure%s)\n", failures ? "FAILED" : "ALL PASSED",
           failures, failures == 1 ? "" : "s");
    return failures ? 1 : 0;
}
