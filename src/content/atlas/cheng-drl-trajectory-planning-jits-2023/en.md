---
tldr: >-
  We trained a connected and autonomous vehicle (CAV) with deep reinforcement learning to choose its
  speed as it leads human-driven cars toward a traffic signal. In simulation it cut the group's fuel
  use by 7.8%, more than our earlier tree-search method, and decided each move about 100 times faster.
hero:
  image: /media/cheng-drl-trajectory-planning-jits-2023/time-space-benchmark-vs-adrl.png
  alt: >-
    Two time-space diagrams of six vehicles driving 400 m toward a signal, with the signal's green, yellow and red
    phases drawn as a colored bar at the stop line. Left, without CAV control, every trajectory goes flat below the
    stop line during the red phase and then climbs again. Right, with ADRL-MTF, the lead CAV (red line) and the five
    cars behind it climb steadily and cross the stop line just as the light turns green.
  caption: >-
    Each line is one vehicle (time to the right, distance up); the colored bar at 400 m is the signal. Without CAV
    control (left) the platoon races to the red light, stops and starts again. With ADRL-MTF (right) the lead CAV
    (red) sets a pace that brings everyone to the stop line as the light turns green.
  credit: From the paper
affiliations:
  - Chang'an University
  - The Pennsylvania State University
  - Missouri University of Science and Technology
  - Southeast University
  - Guangdong University of Technology
author_affiliations: [[1, 3], [2], [1], [4], [5]]
abstract: |-
  This manuscript presents an Adam optimization-based Deep Reinforcement Learning model for Mixed Traffic Flow control (ADRL-MTF), so as to guide Connected and Autonomous vehicle's (CAV) longitudinal trajectory on a typical urban roadway with signal-controlled intersections. Two improvements are made when compared with prior literatures. First, the common assumptions to simplify the problem solving, such as dividing a vehicle trajectory into several segments with constant acceleration/deceleration, are avoided, to improve the modeling realism. Second, built on the efficient Adam Optimization and Deep Q-Learning, the proposed model avoids the enumeration of states and actions, and is computational efficient and suitable for real time applications. The mixed traffic flow dynamic is firstly formulated as a finite Markov decision process (MDP) model. Due to the discretization of time, space and speed, this MDP model becomes high-dimensional in state, and is very challenging to solve. We then propose a temporal difference-based deep reinforcement learning approach, with ε-greedy for exploration-exploitation balance. Two neural networks are developed to replace the traditional Q function and generate the targets in the Q-learning update. These two neural networks are trained by the Adam optimization algorithm, which extends stochastic gradient descent and considers the second moments of the gradients, and is thus highly computational efficient and has lower memory requirements. The proposed model is shown to reduce fuel consumption by 7.8%, which outperforms a prior benchmark model based on Monte Carlo Tree Search. The model's runtime efficiency and stability are tested, and the sensitivity analysis is also performed.
key_numbers:
  - { value: "7.8%", label: "less fuel for the platoon than with no CAV control (709.92 ml down to 654.54 ml)" }
  - { value: "0.0057 s", label: "to decide each half-second move, about 100 times faster than our earlier tree-search method" }
  - { value: "11.94%", label: "fuel saved when every vehicle is a CAV" }
  - { value: "4.7%", label: "fuel still saved with only 1 CAV in every 9 vehicles" }
updated: 2026-10-27
---

## What problem does this research solve?

Anyone who has driven an arterial street knows the pattern: speed up to the next intersection, brake hard for the red light, wait, and accelerate again when it turns green. Each hard stop and restart burns fuel and adds emissions. If a car knew when the light would change, it could ease off early and roll up just as it turns green.

A **connected and autonomous vehicle (CAV)** can do exactly that. It can receive the signal timing from the roadside (vehicle-to-infrastructure communication, V2I), knows its distance to the stop line, and its speed is set by a computer rather than a driver. And because the human-driven vehicles (HDVs) behind it cannot pass on a single lane, the CAV's choice of speed shapes the trajectories of every car in its group. The question is how the CAV should choose that speed, second by second.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/basic-interactive-units.png" alt="Two single-lane road sketches ending at a stop line and a traffic signal. The top lane has one CAV (shaded box) followed by several plain boxes for human-driven cars; the bottom lane has three CAVs, and dashed boxes group each CAV with the cars directly behind it" loading="lazy" />
  <figcaption>Splitting mixed traffic into “basic interactive units”. Each CAV (shaded) leads the human-driven cars behind it (plain boxes) until the next CAV, so a lane with several CAVs (bottom) becomes several small groups, each with one CAV in charge. From the paper.</figcaption>
</figure>

Earlier methods made this problem easier to solve by simplifying it: assuming that every vehicle is a CAV, or cutting each trajectory into a few segments, each driven at a constant speed or a constant acceleration. Those assumptions make the math tractable but the driving unrealistic. Solving the full problem, with human drivers whose behavior is random and with speed adjusted continuously, had been too slow for use in real time. Our own earlier method based on Monte Carlo Tree Search (MCTS) needed about 0.89 seconds of computing for each move.

## What did we do?

We cast the CAV's task as a sequence of decisions, a **Markov decision process (MDP)**. Every half second, the CAV looks at four things:

1. the color of the signal,
2. how much of the current signal phase is left,
3. how much of the road is left before the stop line, and
4. its own speed compared with the speed limit.

It then picks one of 15 acceleration values (from braking to speeding up). The cars behind it respond, the signal counts down, and the CAV receives a score, a **reward**: higher when the whole group burns less fuel (computed with the VT-Micro fuel consumption model), a bonus when the last car clears the intersection, and a penalty when a move leads to a crash or a traffic violation.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/mdp-framework.png" alt="Diagram: on the left, a loop where the environment model sends a state and a reward to the agent (the CAV), which sends an action back; on the right, two road sketches show the vehicles at time t and at time t+1, with the CAV moving by its chosen action and the human-driven cars moving according to the environment model" loading="lazy" />
  <figcaption>One step of the decision process. The CAV (agent) reads the state and reward, chooses an action; the cars behind it move on their own according to the traffic model, and the signal advances. This repeats until the whole group has crossed the stop line. From the paper.</figcaption>
</figure>

The CAV learns by trial and error inside a simulated traffic environment. The human-driven cars in it are deliberately unpredictable: away from the intersection they follow the car ahead using a classic car-following model (the GM model) with a random term added, and near the intersection they react to the signal as people do, driving on through green, stopping for red, and deciding on yellow whether there is enough time to clear.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/hdv-behavior.png" alt="Two flowcharts. Top: far from the signal, a vehicle decides whether to change speed using a car-following model and moves to its new position. Bottom: near the signal, green leads to keeping speed, red leads to slowing to stop before the line, and yellow leads to a check of whether there is enough time left" loading="lazy" />
  <figcaption>How the simulated human drivers behave. Far from the signal (top) they follow the car ahead; close to it (bottom) they respond to green, yellow and red. From the paper.</figcaption>
</figure>

We tested the method on a 400 m single-lane arterial segment with a 30 km/h speed limit, ending at a signal with a 70-second cycle (30 s green, 5 s yellow, 35 s red). A CAV leads a platoon of six vehicles that start near the entrance of the segment.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/experiment-setup.png" alt="Sketch of the test road: a straight single lane from a start position to a stop line with a traffic signal; a shaded CAV leads five plain boxes labeled followed HDVs, with the segment length and average vehicle length marked" loading="lazy" />
  <figcaption>The test scenario: a CAV (shaded) leading five human-driven cars along a 400 m segment toward a signalized stop line. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The decision problem has too many possible situations to list. Three of the four things the CAV observes vary continuously, and so does its acceleration. Classic Q-learning, which keeps a table with a value for every situation and action, is out of the question. We therefore built **ADRL-MTF**, an Adam optimization-based deep reinforcement learning model for mixed traffic flow control:

- **A neural network replaces the table.** A deep Q-network (4 inputs, 5 hidden layers of 256 nodes, one output per acceleration value) estimates how good each action is in any situation. A second, slowly updated "target" network provides the learning targets, which keeps training stable.
- **Exploration that tapers off.** Early in training the CAV often tries random actions (ε-greedy exploration); as training goes on it relies more and more on what it has learned.
- **Efficient training.** Past experiences are stored in a replay buffer and replayed in small random batches, and the networks are trained with the Adam optimizer, which adapts its step size and needs little memory.
- **No shortcuts in the model.** Trajectories are not forced into segments of constant speed or acceleration, and the human drivers keep their randomness.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/adrl-mtf-process.png" alt="Flowchart of the training loop: the Q network chooses an action with an epsilon-greedy policy, the environment model returns the next state and reward, which are stored in a replay buffer; batches from the buffer and the target network give a loss that is minimized with Adam to update the Q network, and the target network copies the Q network every C steps; episodes reset until N episodes are done" loading="lazy" />
  <figcaption>The ADRL-MTF training loop. The Q network picks moves, experiences go into a replay buffer, and batches from the buffer train the network with the Adam optimizer, while a target network copied every C steps supplies the learning targets. From the paper.</figcaption>
</figure>

The heavy work happens once, offline. Training took 50,000 simulated trips and 5 to 16 hours on an ordinary laptop processor (Intel i7-4510U, 8 GB of memory). After that, all the CAV needs while driving is one pass through the trained network per step. The only inputs needed to train a model for a road are its length, its speed limit and its signal timing.

## What are the key findings?

**Less fuel than both the baseline and our earlier method.** With no CAV control, the six-vehicle platoon used 709.92 ml of fuel. With ADRL-MTF guiding the lead CAV it used 654.54 ml, a **7.8%** saving. Our earlier MCTS-based method saved 6.5% in the same setting. The time-space diagrams show why: without control, the platoon drives fast to the red light, stops and starts again (top of the page); both learning methods smooth out the approach.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/mcts-time-space.png" alt="Time-space diagram of six vehicles under the earlier MCTS method: the lead vehicle (red line) and the five behind it climb steadily toward the 400 m stop line and cross it after the red phase ends, without stopping" loading="lazy" />
  <figcaption>Our earlier Monte Carlo Tree Search method on the same scenario also avoids the stop. Compare with ADRL-MTF at the top of the page: ADRL-MTF saves more fuel (7.8% versus 6.5%) and decides far faster. From the paper.</figcaption>
</figure>

**Fast enough for real time.** Once trained, the model planned the whole 93-second trip, 186 half-second steps, in 1.06 seconds of computing: **0.0057 seconds per step**. The MCTS method needed about 0.89 seconds per step, so ADRL-MTF is about **100 times faster**, well inside the half-second the CAV has to decide.

**Robust to different traffic.** We changed how far apart the cars start, using four different spacing patterns (uniform and normal distributions, with denser and sparser traffic). The fuel savings stayed between **8.04% and 8.85%**.

**It works even with few CAVs.** We also varied the share of CAVs, which changes how many human-driven cars each CAV leads. When every vehicle is a CAV, fuel savings peak at **11.94%**. With 1 CAV in every 9 vehicles (an 11% market penetration rate), they are still **4.7%**, but at 1 in 10 they drop to 2.7%: the slowdown the CAV starts takes longer to reach the back of a longer line of human drivers.

<figure>
  <img src="/media/cheng-drl-trajectory-planning-jits-2023/fuel-savings-by-cav-share.png" alt="Line chart of fuel saved against the number of vehicles led by one CAV, from 1 (100% CAVs) to 10 (10% CAVs). Savings are 11.94% at 1, about 9 to 10% from 2 to 5, then fall to 7.80%, 6.92%, 5.27%, 4.70% and 2.70% at 10" loading="lazy" />
  <figcaption>Fuel saved as each CAV leads more human-driven cars. Savings are highest with all CAVs and stay above 4.7% down to 1 CAV in every 9 vehicles. Data from the paper (Figure 9), redrawn.</figcaption>
</figure>

**Road design matters.** A model has to be retrained for a new road, so we trained it on longer segments and higher speed limits. Savings shrink on longer links, where the fuel spent on the open road dilutes the gain at the signal, and grow with the speed limit, which gives the CAV more room to adjust its speed.

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">Road segment</th><th scope="col" class="num">No CAV control (ml)</th><th scope="col" class="num">ADRL-MTF (ml)</th><th scope="col" class="num">Fuel saved</th></tr>
      </thead>
      <tbody>
        <tr class="is-highlight"><th scope="row">400 m, 30 km/h<span>Main test</span></th><td class="num">709.92</td><td class="num">654.54</td><td class="num">7.8%</td></tr>
        <tr><th scope="row">500 m, 30 km/h</th><td class="num">769.57</td><td class="num">730.61</td><td class="num">5.06%</td></tr>
        <tr><th scope="row">500 m, 36 km/h</th><td class="num">790.02</td><td class="num">738.16</td><td class="num">6.56%</td></tr>
        <tr><th scope="row">1,000 m, 30 km/h</th><td class="num">1,436.06</td><td class="num">1,366.68</td><td class="num">4.83%</td></tr>
        <tr><th scope="row">1,000 m, 60 km/h</th><td class="num">1,246.81</td><td class="num">1,075.79</td><td class="num">13.72%</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Platoon fuel use on segments of different length and speed limit. On the 1,000 m segment, raising the limit from 30 to 60 km/h nearly triples the savings. From Tables 7 and 8 of the paper.</figcaption>
</figure>

## What can this be used for?

- **Eco-driving for connected and automated vehicles**: a speed advisor or controller for signalized arterials that needs only the road length, speed limit and signal timing to train, and very little computing to run.
- **Getting benefits early in the transition**: because one CAV shapes the trajectories of the cars behind it, fuel savings appear long before every vehicle is automated, as long as roughly 1 vehicle in 9 is a CAV.
- **Signal and corridor agencies**: the method relies on vehicles receiving signal timing in real time (V2I), and the results point to where the savings are largest: shorter links and higher speed limits.

The study covers a single lane approaching one signal, in simulation, and a model has to be retrained whenever the road length, speed limit or signal timing plan changes.
