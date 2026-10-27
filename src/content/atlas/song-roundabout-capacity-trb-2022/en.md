---
tldr: >-
  We built a roundabout capacity formula from how entering cars actually behave, stopping, accelerating
  or following one another into a gap, so that it needs the measured circulating speed instead of a
  hard-to-calibrate critical gap. Tested on drone video from four real roundabouts, it estimated entry
  capacity with 7% to 17% error, against 14% to 32% for the Highway Capacity Manual (HCM6) model.
hero:
  image: /media/song-roundabout-capacity-trb-2022/opendd-roundabout-4.jpg
  alt: Overhead drone image of a single-lane roundabout with a grassy central island and four approach roads meeting it at angles.
  caption: >-
    One of the four single-lane roundabouts we tested the model on, seen from a drone. Every car arriving on an
    approach has to yield and wait for a big enough gap in the traffic already circling the island. How many cars
    per hour can get in that way is the entry capacity.
  credit: openDD dataset (Breuer et al., 2020), from the paper
affiliations:
  - Pennsylvania State University
  - Arizona State University
author_affiliations: [[1], [1], [2], [2]]
abstract: |-
  This manuscript focuses on the theoretical advancement of causality between entry vehicle dynamics and roundabout capacity modeling, with a merging state transition-based analytical approximation and calibration approach. Gap acceptance models, such as the HCM model, usually ignore roundabout specific operating conditions, whereas empirical models are generally criticized for the lack of fundamental understanding of underlying traffic flow or driving behaviors. The roundabout geometry is firstly extracted into a Y-shaped network, and the traffic movements are illustrated with a state-space-time diagram. Next, we analyze the merging state space for the entry vehicles, and draw the state-transition diagram. The episode of a traffic flow is defined, and we show that the trajectory of an entry vehicle repeats one of four patterns within each episode. Then, state transition-based analytical derivation of roundabout capacity is presented. This is done by estimating the state transition probabilities, followed by an episode-based state transition chain analysis and, finally, finding the solution of state transitions under steady states. Circulating speed is used as a key variable to reflect the operating conditions in the target roundabout. For a special scenario, with all four entry approaches being saturated, we model the interactions between entry flow and circulating flow, and prove that the resulting model can be uniquely solved by classic root-finding algorithms. The accuracy of the proposed model is tested with OpenDD, a real-world high-resolution trajectory dataset collected by drones at four roundabouts. The results of the proposed model are shown to consistently outperform the HCM6 model and another gap acceptance-based model.
key_numbers:
  - { value: "7–17%", label: "capacity error of our model across the roundabout entries tested, versus 14–32% for the HCM6 model" }
  - { value: "9.6%", label: "error at Roundabout 4 with all entries combined, down from 24.7% with HCM6" }
  - { value: "4", label: "real single-lane roundabouts, each filmed by drone for at least 7 hours" }
  - { value: "23.8–26.1 km/h", label: "measured circulating speeds, the main site-specific input the model needs besides traffic flow" }
updated: 2026-10-27
---

## What problem does this research solve?

Roundabouts are safer than most intersections: traffic flows one way around a central island, there are fewer
points where vehicles can collide, and speeds stay low. Before an agency decides to build one, or chooses its
size and shape, it needs to know how much traffic the roundabout can handle. The key number is **entry
capacity**: the most cars per hour that can enter from one approach when there is always a queue waiting at the
yield line, ready to take any usable gap in the circulating traffic.

There are two standard ways to estimate it, and both have a weak spot.

- **Gap-acceptance models**, such as the one in the Highway Capacity Manual (HCM), ask how often the circulating
  traffic leaves a gap long enough for a waiting driver. The answer hinges on the **critical gap**, the shortest
  gap a driver will accept. In practice a fixed textbook value is used, which ignores how a particular roundabout
  operates and how it is built. Measuring the critical gap at each site instead is labor-intensive.
- **Empirical models** fit a regression between measured capacity and geometry or traffic. They match the data
  they were fitted to, but they transfer poorly to other places and say little about the driving behavior behind
  the numbers.

We wanted a model that explains capacity from what entering drivers actually do, and whose inputs are easy to
measure at any roundabout.

## What did we do?

We started by stripping a roundabout down to the one place that matters for capacity: the point where an
entering car meets the circulating traffic. That becomes a small **Y-shaped network**. Circulating cars come from
A, entering cars from B, both meet at the conflict point C and continue to D. We added one extra node, W, which
stands for "waiting at the yield line".

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/roundabout-to-y-network.png" alt="Left, a sketch of a four-leg roundabout with red entering cars, blue circulating cars, a yield sign at the south approach and a star at the conflict point C between points A, B and D. Right, the same movements drawn as a Y-shaped network: arrows from A and B meet at C and continue to D, and a green box W is linked to C by arrows in both directions" loading="lazy" />
  <figcaption>From roundabout to network. Left: entering cars (red) at the south approach must yield to circulating cars (blue) at the conflict point C. Right: the same situation as a Y-shaped network. A car that cannot merge right away takes a detour to the dummy node W, waits there, and comes back to C when a gap opens. From the paper.</figcaption>
</figure>

On this network, every car can be drawn as a line in a **state-space-time diagram**, with time running to the
right and the network nodes stacked vertically. The diagram makes the traffic pattern visible. We call the time
between two circulating cars passing the conflict point an **episode**. In each episode the same thing happens:
the first entering car has to stop, then it accelerates into the gap, the cars queued behind it may follow
without stopping, and the next circulating car ends the run and forces the next entering car to stop.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/state-space-time-diagram.png" alt="A diagram with time on the horizontal axis and the nodes B, C, A, C, D and W on the vertical axis. Green lines are entering cars going from B to C and on to D, blue lines are circulating cars going from A through C to D, and red dashed vertical lines send one entering car down to W and back. An arrow marks one episode between two blue lines" loading="lazy" />
  <figcaption>Traffic on a state-space-time diagram. Green lines are entering cars, blue lines circulating cars. The first entering car arrives at J, but the next circulating car (H) is too close, so the car drops to the waiting node W (red dashed line), waits until L, then merges (MN). The next entering car (Q) finds enough room and merges without stopping. One episode runs from one circulating car (H) to the next (V). From the paper.</figcaption>
</figure>

We then described the car at the head of the entry queue by one of three **merging states**:

- **Wait (S1)**: no acceptable gap, so the car stops at the yield line.
- **Accelerate (S2)**: a gap opens and the stopped car accelerates from zero into the roundabout.
- **Follow (S3)**: the gap is still open when the car reaches the yield line, so it follows the car ahead into the roundabout without stopping.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/three-merging-states.png" alt="Three small copies of the Y-shaped network. In each, red dotted arrows mark the links the entering car uses: in the first it turns off into the waiting node W, in the second it comes back from W and continues to D, and in the third it goes straight through C to D" loading="lazy" />
  <figcaption>The three merging states on the Y-shaped network. Left, wait: the car turns into the waiting node W. Middle, accelerate: it leaves W and merges toward D from a standstill. Right, follow: it goes straight through C to D without stopping. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

**A small set of state changes describes every merge.** Only six transitions between the three states are
physically possible: a stopped car can keep waiting or start to accelerate, but it can never jump straight to
"follow", and a car that has not stopped can never be "accelerating from zero". Each new state depends only on
the state of the car just ahead, so the sequence of states is a **Markov chain**. That makes it possible to
write down, in closed form, the probability of each kind of episode: no car gets in, exactly one gets in, two
get in, or a whole platoon of n cars gets in.

<figure class="figure-narrow">
  <img src="/media/song-roundabout-capacity-trb-2022/state-transition-diagram.png" alt="Three ovals labeled S1, S2 and S3 connected by arrows. S1 loops back to itself and connects to S2 in both directions; S2 points to S3; S3 loops back to itself and points to S1" loading="lazy" />
  <figcaption>The six possible transitions. S1 (wait) can repeat or lead to S2 (accelerate); S2 leads to S1 or S3 (follow); S3 can repeat, which is a platoon of cars entering together, or end the run back in S1. From the paper.</figcaption>
</figure>

**The critical gap comes from vehicle kinematics, not a lookup table.** A stopped car can safely merge if the
gap leaves room on both sides: behind the circulating car ahead, one perception-reaction time, and in front of
the circulating car behind, that driver's reaction time plus the time needed to brake from the circulating
speed. So the critical gap is twice the reaction time plus the circulating speed divided by the vehicle's
braking rate. Each extra car in a platoon needs one more reaction time plus the
time to brake from its own entry speed. We assumed entering cars speed up steadily until the fifth one enters at
the full circulating speed, in line with the HCM practice of counting saturation flow from the fifth vehicle.

Put together, this gives a single closed-form formula for entry capacity. Its inputs are the **circulating flow**
(as in gap-acceptance models), the **circulating speed**, the driver's **perception-reaction time** and the
vehicle's **braking rate**. The circulating speed does the job of the critical gap, but it also carries what is
specific to the site: the island radius, lane width, speed limit and grade all show up in how fast cars circle.
And it is easy to measure from partial vehicle trajectories, such as smartphone or connected-vehicle data or
drone video.

**When every approach is queued, entry and circulating flow depend on each other.** Cars that enter from one
approach become circulating traffic for the next. For a symmetric roundabout with all four approaches saturated,
we tied the circulating flow to the entry flow through a **traffic circulating index**, which reflects how far
cars travel around the island before they exit. We proved that the resulting equation always has exactly one
solution, which a standard root-finding method (Newton's method) finds quickly. The paper also extends the
derivation to two-lane entries facing two circulating lanes.

## What are the key findings?

We tested the model on **openDD**, a public drone dataset of four single-lane, four-leg roundabouts. Each was
filmed at 30 frames per second for 7 to 7.7 hours, including morning and afternoon rush periods, which yields
thousands of passenger-car trajectories per roundabout.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/opendd-four-roundabouts.jpg" alt="Four overhead drone images of single-lane roundabouts, arranged two by two, each with a grassy central island and four approach roads" loading="lazy" />
  <figcaption>The four roundabouts in the openDD dataset, numbered 1 to 4 from top left. From the paper, openDD dataset (Breuer et al., 2020).</figcaption>
</figure>

From the video we picked out 30-second periods in which at least one car was waiting at the yield line of an
approach the whole time, so the entry was running at capacity. We compared what the cars actually achieved with
three models: ours, HCM6, and a newer gap-acceptance model that accounts for vehicles exiting the roundabout (Qu
et al., 2014). To give the benchmarks a fair chance, we calibrated their critical gap (4.59 to 5.40 s) and
follow-up headway (2.51 to 3.10 s) at each roundabout. For our model we used a reaction time of 1.33 s, a
braking rate of 4.51 m/s² and the circulating speed measured at each roundabout.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/capacity-vs-conflicting-flow.png" alt="Line chart of entry capacity in vehicles per hour against conflicting flow from 100 to 1,700 vehicles per hour. Red dots and a red line are the observed capacities, falling from about 1,200 to about 480. A blue line, our model, follows them closely. A green line, HCM6, runs well below them. A yellow line, the newer gap-acceptance model, is in between and flattens out at about 600" loading="lazy" />
  <figcaption>Roundabout 1: entry capacity as circulating traffic grows. Red is what the cars actually did (dots are individual 30-second periods), blue is our model, green is HCM6 with its critical gap calibrated at this site, and yellow is the gap-acceptance model of Qu et al. HCM6 underestimates capacity across the range, as other studies have also found; our model tracks the observations. From the paper.</figcaption>
</figure>

- **Our model was the most accurate at every roundabout.** Across the individual approaches, the paper reports
  a mean absolute percentage error (MAPE) of 7% to 17% for our model, against 14% to 32% for HCM6 and 10% to 38% for the
  newer gap-acceptance model.
- With all approaches combined, the error fell to about 9.4% to 9.8% at three of the four roundabouts and
  15.6% at Roundabout 2, where only 14 saturated periods could be found.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/mape-four-roundabouts.png" alt="Grouped bar chart of capacity error for four roundabouts. Roundabout 1: HCM6 21.0 percent, Qu et al. 12.4, this paper 9.4. Roundabout 2: 26.4, 19.7, 15.6. Roundabout 3: 17.7, 16.2, 9.8. Roundabout 4: 24.7, 18.3, 9.6" loading="lazy" />
  <figcaption>Capacity error at each roundabout, all approaches combined; lower is better. The number of saturated 30-second periods available is shown under each roundabout. Chart drawn from the numbers in the paper's Table 4.</figcaption>
</figure>

**Capacity behaves the way traffic engineers would expect.** Sensitivity tests showed entry capacity falls as
circulating traffic gets heavier, because there are fewer usable gaps, and also as circulating speed rises,
because a faster car behind needs more time to brake, so drivers need longer gaps. Capacity peaks at about
1,500 vehicles per hour when circulating traffic is light and slow. With all four approaches queued, it peaks
lower, at about 1,300 vehicles per hour, and falls further when cars travel farther around the island before
exiting, which makes the circulating stream denser.

<figure>
  <img src="/media/song-roundabout-capacity-trb-2022/sensitivity-surfaces.jpg" alt="Two 3D surface plots of estimated entry capacity. Left, against circulating flow from 200 to 1,200 vehicles per hour and circulating speed from 15 to 32.5 km/h, the surface falls from about 1,500 in the red corner to about 500 in the purple corner. Right, against traffic circulating index from 0.4 to 2.0 and circulating speed, falling from about 1,300 to about 500" loading="lazy" />
  <figcaption>How entry capacity responds to traffic. Left: one approach queued, varying circulating flow and circulating speed. Right: all four approaches queued, varying the traffic circulating index (how far cars travel around the island) and circulating speed. Red is high capacity, purple low. From the paper.</figcaption>
</figure>

**A 30-second window worked best.** We also varied the analysis window from 10 to 60 seconds. Very short
windows contain too few entering cars, so one car more or less swings the result; long windows are more likely to
include moments when the queue clears. Our model was the most accurate at every window length, did best at 30
seconds, and stayed within roughly 10% to 20% error throughout.

## What can this be used for?

- **Capacity checks for planned or existing roundabouts**: a transparent formula whose site-specific input,
  circulating speed, can be measured from drone video, smartphone traces or connected-vehicle data, instead of
  calibrating critical gaps by hand at every site.
- **Comparing designs**: because the island size, lane width and speed limit act on capacity through the
  circulating speed, the model gives designers a direct way to see how a geometric choice changes how much
  traffic an entry can take.
- **Network-wide analysis**: the all-approaches-queued version links each entry to the others, which matters when
  a roundabout is congested on every side at once.
- **Next steps**: the paper derives a two-lane version that still needs testing against field data, and the same
  approach could be applied to compact and turbo roundabouts.

We used a similar merging-based analysis to estimate the capacity lost to cars entering from a side street
across a bus lane; see our page on [bus-lane discharge rates](/tang-bus-lane-discharge-trb-2021/).
