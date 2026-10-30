---
tldr: >-
  We let a connected and autonomous vehicle (CAV) leading a line of human-driven cars toward a traffic
  signal plan its speed the way a Go-playing program plans its moves, with Monte Carlo Tree Search. In
  simulation the group used 6.5% less fuel or spent 3.5% less time, and our improved search ran 8 times
  faster than the standard version, quick enough for real time.
hero:
  image: /media/cheng-mcts-mixed-traffic-trr-2020/time-space-benchmark-vs-mcts-mtf.png
  alt: >-
    Two time-space diagrams of six vehicles driving 400 m toward a signal, with the signal's green, yellow and red
    phases drawn as a colored bar at the stop line. Left, without CAV control, all six trajectories climb steeply,
    go flat just below the stop line while the light is red, and climb again after it turns green. Right, with
    MCTS-MTF, the lead CAV (red line) and the five cars behind it climb at a gentler, steady slope and reach the
    stop line as the light turns green, without stopping.
  caption: >-
    Each line is one vehicle (time to the right, distance up); the colored bar at 400 m is the signal. Without CAV
    control (left) the cars hurry to the red light, wait, and start again. With MCTS-MTF (right) the lead CAV (red)
    slows the whole group early so that it rolls through as the light turns green.
  credit: From the paper
affiliations:
  - Missouri University of Science and Technology
  - Chang'an University
  - Zhejiang University
  - Old Dominion University
author_affiliations: [[2, 1], [1], [1], [3], [4]]
abstract: |-
  This manuscript presented a model-free approach based on Monte Carlo Tree Search (MCTS) algorithm for the control of mixed traffic flow of Human-Driven Vehicles (HDV) and connected and autonomous vehicles (CAV), named MCTS-MTF, on a one-lane roadway with signalized intersection control. Previous researches often simplified the problem with certain assumptions to reduce computational burden, such as dividing a vehicle trajectory into several segments with constant speed or linear acceleration/deceleration which was rather unrealistic. This manuscript departed from the existing research that minimum constraints on CAV trajectory control were required, as long as the basic rules such as safety consideration and vehicular performance limit were followed. Modeling efforts were made to improve the algorithm solution quality and the runtime efficiency over naïve MCTS (n-MCTS) algorithm. This was achieved by an exploration-exploitation balance calibration module, and a tree expansion determination module to more effectively expand the tree along the desired direction. The case study results found that the proposed algorithm was able to achieve a travel time saving of 3.5% and a fuel consumption of 6.5%. It was also demonstrated to run 8 times the speed of a naïve MCTS model, suggesting a promising potential for real-time or near real-time applications.
key_numbers:
  - { value: "6.5%", label: "less fuel for the six-vehicle group when the CAV aims to save fuel (776.02 ml down to 725.38 ml)" }
  - { value: "3.5%", label: "less total travel time when the CAV aims to save time (475 s down to 458.5 s)" }
  - { value: "8×", label: "faster than a standard (naïve) Monte Carlo Tree Search" }
  - { value: "0.89 s", label: "of computing for each 1-second move, so the CAV decides in time" }
updated: 2026-10-27
---

## What problem does this research solve?

On an arterial street with traffic signals, drivers tend to hurry to the next intersection, brake for the red light, wait, and accelerate again when it turns green. Each stop and restart wastes fuel and time. A car that knew when the light would change could ease off early and arrive just as it turns green.

<blockquote class="pull-quote">
  <p><strong>A connected and autonomous vehicle (CAV) can do that.</strong> It receives the signal timing from the roadside (vehicle-to-infrastructure communication), including which light is on and how many seconds are left; it knows its distance to the stop line; and it can sense the speed and spacing of the car behind it. <strong>On a single lane, the human-driven vehicles (HDVs) behind the CAV cannot pass, so the speed the CAV chooses shapes the trip of every car in its group.</strong></p>
</blockquote>

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/basic-interactive-units.png" alt="Two single-lane road sketches running from a start position to a stop line. The top lane has one CAV (shaded box) followed by several plain boxes for human-driven cars; the bottom lane has three CAVs, and dashed boxes group each CAV with the cars directly behind it" loading="lazy" />
  <figcaption>Splitting mixed traffic into “basic interactive units”. Each CAV (shaded) leads the human-driven cars behind it (plain boxes) until the next CAV, so a lane with several CAVs (bottom) becomes several small groups, each with one CAV in charge. From the paper.</figcaption>
</figure>

Choosing that speed second by second is a hard optimization problem: each trajectory can take endless shapes, and human drivers react to the CAV in ways that are complex to model. Earlier methods made it solvable by simplifying it, for example by cutting every trajectory into a few segments, each at a constant speed or a constant acceleration. That keeps computing time low, but at the cost of realism and flexibility.

## What did we do?

We treated the CAV's task like a board game. In the game of Go, a program based on **Monte Carlo Tree Search (MCTS)** tries out many possible moves, plays each one out to the end of the game in simulation, and uses the results to decide which branch of possible futures is worth exploring further. Our method, **MCTS-MTF** (MCTS for mixed traffic flow), does the same for driving: at each one-second step the CAV considers speeding up, slowing down or holding its speed, simulates how the cars behind would respond and how the trip would end, and picks the move that leads to the best outcome.

The only rules the CAV must respect are safety and the vehicle's own limits. Its trajectory is not forced into segments of constant speed or acceleration, so at any moment it can accelerate, decelerate or cruise. The interaction goes both ways: the CAV's moves change how the human drivers behave, and their behavior feeds back into the CAV's next choice.

We tested two goals for the search: the **total travel time** of the group, and its **total fuel consumption**, computed with the VT-Micro fuel consumption model. In the simulation, the human drivers follow the car ahead with a well-known car-following model (the optimal velocity model) and react to the signal near the intersection, stopping for red and deciding on yellow whether they can clear the intersection in time.

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/test-road.png" alt="Sketch of the test road: a straight single lane from a start position to a stop line with a traffic signal; six boxes labeled HDV platoon, with the segment length, the average vehicle length and one vehicle's distance from the start marked" loading="lazy" />
  <figcaption>The test scenario: a 400 m single-lane segment ending at a signal with a 70-second cycle (30 s green, 5 s yellow, 35 s red). Six vehicles travel at a free-flow speed of 8.33 m/s (about 20 mph); when a CAV is present, it is the first vehicle. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

A standard (“naïve”) MCTS works, but it is slow and its results depend on how it is tuned. We added two modules that make the search both better and faster:

- **Tuning how adventurous the search is.** MCTS has to balance *exploitation* (digging deeper into moves that already look good) against *exploration* (trying moves it has rarely tried). One parameter, C, sets that balance. Instead of using the textbook value, we calibrate C by stepping through a range of values on a logarithmic scale. For travel time and for fuel alike, the best value turned out to be about 0.08.
- **Searching only when it matters.** The standard method launches a full search at every step, even when traffic has hardly changed. That adds no information, can add random noise, and wastes computing. We estimate how strongly a change in the CAV's speed would ripple back through the cars behind it, using the car-following model, and launch a new search only when that impact is large enough. Otherwise the CAV simply moves on to the next step.

<figure class="figure-narrow">
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/mcts-mtf-framework.png" alt="Flowchart of MCTS-MTF. At the top, a loop takes the current state of all vehicles and asks whether to launch MCTS; if not, the CAV moves and the state is updated. If yes, the search repeats N times through four dashed boxes: selection (choose the action with the best UCT score, using the calibrated C and the set of allowed actions), expansion (pick a random action), simulation (keep picking random actions until all vehicles have passed the stop line) and backpropagation (compute the final benefit and update the node values). After N iterations the CAV takes the best action" loading="lazy" />
  <figcaption>How MCTS-MTF decides. The top box checks whether a new search is needed. If it is, the search runs its four classic steps (selection, expansion, simulation, backpropagation) N times, using the calibrated balance parameter C, and the CAV then takes the move with the best average result. From the paper.</figcaption>
</figure>

## What are the key findings?

**Both goals improve, and fuel has more room.** Without CAV control, the six vehicles took 475 seconds in total and burned 776.02 ml of fuel. With the CAV aiming for the shortest travel time, MCTS-MTF cut travel time by **3.5%** and, as a side effect, fuel by 5.1%. Aiming for the least fuel, it cut fuel by **6.5%** and travel time by 2.8%. In every case MCTS-MTF beat the naïve MCTS.

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">Method</th><th scope="col" class="num">Total travel time (s)</th><th scope="col" class="num">Total fuel (ml)</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">No CAV control<span>All six vehicles human-driven</span></th><td class="num">475</td><td class="num">776.02</td></tr>
        <tr><th scope="row">Naïve MCTS<span>Goal: travel time</span></th><td class="num">463.5 (−2.4%)</td><td class="num">747.3 (−3.7%)</td></tr>
        <tr class="is-highlight"><th scope="row">MCTS-MTF<span>Goal: travel time</span></th><td class="num">458.5 (−3.5%)</td><td class="num">736.76 (−5.1%)</td></tr>
        <tr><th scope="row">Naïve MCTS<span>Goal: fuel</span></th><td class="num">462 (−2.7%)</td><td class="num">732.57 (−5.6%)</td></tr>
        <tr class="is-highlight"><th scope="row">MCTS-MTF<span>Goal: fuel</span></th><td class="num">461.5 (−2.8%)</td><td class="num">725.38 (−6.5%)</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Results for the six-vehicle group on the 400 m test road. MCTS-MTF improves on the naïve search for both goals. From Section 4.1 of the paper.</figcaption>
</figure>

The time-space diagrams show why. Without control, the cars drive at full speed to the red light, stop, and start again. With a CAV in front, the group drives more slowly at first and crosses the stop line soon after the light turns green. The red light puts a ceiling on how much travel time can be saved, whereas fuel depends on how smooth the trajectories are, which leaves more room for improvement.

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/time-space-all-methods.png" alt="Five time-space diagrams. a: full human-driven flow, where all trajectories flatten below the stop line during red. b and c: MCTS-MTF with the travel-time and fuel goals, where trajectories rise steadily and cross the stop line around the start of green. d and e: naïve MCTS with the same goals, where the vehicles barely move for about the first 20 seconds and then accelerate steeply to the stop line" loading="lazy" />
  <figcaption>All five runs side by side: (a) no CAV control; (b, c) MCTS-MTF aiming for travel time and for fuel; (d, e) naïve MCTS with the same goals. The naïve search lingers near the start and then accelerates sharply, which costs more fuel than the smoother MCTS-MTF trajectories. N is the number of search iterations. From the paper.</figcaption>
</figure>

**A few iterations already pay off.** With only 15 search iterations, fuel use already dropped by about 5%; more iterations brought it to 6.5%. After about 90 iterations the result stayed within 5 ml (0.68%) from run to run.

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/fuel-convergence.png" alt="Line chart of fuel consumption against the number of search iterations, from 0 to 150. Fuel falls from about 776 ml at 0 iterations to about 740 ml at 15, wobbles between about 725 and 755 ml up to 70 iterations, and settles near 726 to 730 ml from 90 iterations on" loading="lazy" />
  <figcaption>Fuel use of the group as the number of search iterations grows. Most of the saving comes in the first 15 iterations, and the result settles after about 90. From the paper.</figcaption>
</figure>

**Fast enough for real time.** On a desktop computer (Intel Core i9-9920X, 64 GB of memory), MCTS-MTF planned the whole trip in 73 seconds, while the vehicles needed about 82 seconds to drive it. That works out to about **0.89 seconds of computing for each one-second step**, so each decision is ready before it is needed, and MCTS-MTF ran **8 times faster** than the naïve search. As with a Go program, what matters is not how long the whole game takes but whether each move is ready in time.

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/decision-timing.png" alt="Timeline from t-start to t-terminal with ticks at t minus delta t, t and t plus delta t, one second apart. MCTS-MTF launches at t minus delta t, runs for 0.89 seconds, returns its action just before t, and the CAV moves at t" loading="lazy" />
  <figcaption>Why 0.89 seconds is fast enough: the search starts one step ahead, using the predicted positions of the human-driven cars, and returns its answer before the CAV has to move. From the paper.</figcaption>
</figure>

**Savings depend on how busy the road is.** We repeated the test at six traffic levels, from level of service (LOS) A (free flow) to F (heavily congested). Travel time savings peaked at LOS D (5.5%) and were zero at LOS A, where there is little delay to remove. Fuel savings were largest in light traffic, 10.7% at LOS B and 9.5% at LOS A, and fell to 1 to 1.6% once traffic became congested.

<figure>
  <img src="/media/cheng-mcts-mixed-traffic-trr-2020/savings-by-level-of-service.png" alt="Grouped bar chart of savings at levels of service A to F. Travel time saved: 0.0, 3.0, 3.5, 5.5, 1.7 and 2.9 percent. Fuel saved: 9.5, 10.7, 6.5, 5.4, 1.0 and 1.6 percent" loading="lazy" />
  <figcaption>Savings at different traffic levels. Fuel savings are largest in light traffic; travel time savings are largest in moderately busy traffic (LOS D). Data from Table 1 of the paper, redrawn.</figcaption>
</figure>

## What can this be used for?

- **Eco-driving for connected and automated vehicles**: a speed controller for signalized arterials that needs only the signal timing, the distance to the stop line and the car behind, and that can pursue either fuel savings or shorter travel times.
- **Benefits before every car is automated**: because one CAV sets the pace for the human-driven cars behind it, savings appear with a single CAV at the head of a group.
- **Signal and corridor agencies**: the method depends on vehicles receiving signal phase and timing in real time, and the results show where the gains are largest: light-to-moderate traffic.

The study covers one lane approaching one signal, in simulation. Extending it to multi-lane networks and to several CAVs working toward a common goal is left for future work. Our [follow-up study](/cheng-drl-trajectory-planning-jits-2023/) replaced the tree search with deep reinforcement learning, which saves more fuel and decides much faster.
