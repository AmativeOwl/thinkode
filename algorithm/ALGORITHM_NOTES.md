Readings: 
1. FSRS (Free Spaced Repetition Scheduler) Algorithm Wiki - https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm

Serves as a reference for the practical implementation of the algorithm, incorporating analysis on the DSR (Difficulty, Stability, Resilience) model, equations and the calculation of spaced intervals.  

2. IEEE Paper: "Optimising Spaced Repetition Schedule by Capturing the Dynamics of Memory" - https://www.scribd.com/document/901213478/3534678-3539081

Offers the theoretical basis, covering the full framework to be implemented. The memory prediction and schedule optimisation loop will be what the ZDP engine adapts from.

3. Baker's "Item Response Theory" Guide 

Offers a foundational understanding of the measurement of ability from responses (that is, gauging understanding from attempt history). A C function will include a numerical parameter to determine a user's current capability in a quantitative manner.

4. Vygotsky's Zone of Proximal Development 

The philosophical justification that underpins the product. The algorithm will try and target the gap between what a user can do alone and what they can do with help in a computational manner.