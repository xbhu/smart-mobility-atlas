---
tldr: >-
  We derived, in one closed-form formula, how much a slow merging car cuts the number of vehicles a
  freeway can let through, and used it to decide where and how fast an autonomous car should merge
  from an on-ramp. The formula matched NGSIM field data within 5%, and the merging plan cut delay
  and crash risk by about 7% to 20% compared with two common merging rules.
hero:
  image: /media/tang-freeway-merging-tits-2025/ngsim-flow-drop.png
  alt: Line chart of flow rate and speed over a morning at an I-80 loop detector. Speed (red) plunges between 8 and 10 am, and flow (blue) sinks inside a dashed box during the same period.
  caption: >-
    Flow (blue) and speed (red) at a loop detector in an on-ramp merge area on I-80, California.
    When traffic jams between 8 and 10 am, the detector counts fewer cars (dashed box), not more:
    merging vehicles reduce how many cars the freeway can discharge.
  credit: Tang & Hu (2025), NGSIM data
affiliations:
  - Old Dominion University
  - The Pennsylvania State University
author_affiliations: [[1], [2]]
abstract: |-
  The core of the freeway merging control problem lies in the dynamic queue propagation and dissipation corresponding to the behavior and state of merging vehicles. Traditionally, queuing has been modeled through demand-supply interactions, with time-varied demand and fixed capacity as supply. However, field observations indicate that flow rates decrease at freeway merging areas during congestion, primarily due to the impact of intersecting traffic—a factor overlooked in the fundamental diagram. This manuscript introduces an analytical approach to characterize and control the dynamic multi-stage merging process of autonomous vehicles, prioritizing traffic flow efficiency and safety. For the first time, the effective discharge rate at the merging point, reduced by the multi-stage dynamic merging process, is analytically derived using an explicit closed-form formulation. Leveraging this expression, we derive dynamic traffic flow performance measurements, including queue length and traffic delay, which serve as the first objective. Additionally, a crash risk function is established to quantitatively assess potential collisions during the merging process, serving as the second objective. Finally, we formulate this problem as a dynamic programming problem to jointly minimize delay and crash risk, with the merging location and speed as decision variables. Given the terminal state's availability, we formulate the ramp vehicle merging task as a recursive optimization problem, employing backward induction to find the minimum-cost solution. Numerical experiments are conducted to validate the derived effective discharge rate using the NGSIM dataset. The results indicate that the proposed model outperforms two benchmark algorithms, leading to a more efficient and safer merging process.
key_numbers:
  - { value: "4.8%", label: "error of the predicted merge-area discharge rate against NGSIM I-80 data, versus 37.3% when a fixed capacity is assumed" }
  - { value: "4.9%", label: "error on a second I-80 period, versus 18.9% with a fixed capacity" }
  - { value: "13.7–19.7%", label: "less delay and crash risk than merging into the first acceptable gap" }
  - { value: "6.9–8.6%", label: "less delay and crash risk than always merging at the end of the lane" }
updated: 2026-10-26
---

## What problem does this research solve?

Freeway on-ramps are where a lot of congestion, crashes and stop-and-go waves begin. A car coming down the ramp is usually slower than mainline traffic. It speeds up on the short auxiliary lane, looks for a gap and cuts in. Every car behind it on the freeway then has to slow down, and the queue that forms takes time to clear.

Traffic engineers usually estimate queues and delay with a simple rule: the queue grows whenever more cars arrive than the road's **capacity**, a fixed maximum number of cars per hour. Field data show that at a merge this capacity is not fixed. On I-80 in California, a loop detector in a ramp merge area counted *fewer* cars per hour during the morning jam (top of the page). Vehicle trajectories from the same freeway show why.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/merge-headway-trajectories.png" alt="Time-space diagram of many vehicle trajectories drawn as thin black lines; two highlighted vehicles show a small time gap before a lane change and a larger gap after it" loading="lazy" />
  <figcaption>Vehicle trajectories on I-80 around a merge. After a car cuts in (purple), the freeway car behind it slows down and falls back: its time gap to the car ahead grows from h<sub>bef</sub> to the much larger h<sub>aft</sub>, and may never shrink back. Larger gaps mean fewer cars per hour. From the paper, NGSIM data.</figcaption>
</figure>

So the real outflow of a merge area, which we call the **effective discharge rate**, depends on how many cars merge and how fast they are going when they do. Until now there was no closed-form formula for it. Without one, it is impossible to link a merging car's decision (merge now, or speed up and merge later) to the queue and the delay it causes, and so it is hard to tell an autonomous vehicle (AV) how to merge well.

## What did we do?

We looked at a typical on-ramp: a ramp feeding an auxiliary lane that runs alongside the freeway and ends a short distance downstream. An autonomous car on the ramp can merge anywhere along that lane. That choice is a trade-off:

- **Merge early**, as soon as a gap appears. Gaps are easier to find at low speed, but the slow car disrupts freeway traffic, and the large speed difference raises the risk of hard braking and rear-end crashes.
- **Merge late**, at the end of the lane. The car has had time to reach freeway speed, so it disrupts less, but it needs a larger gap at that speed. If none comes, it is forced to cut in anyway, which is dangerous.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/merging-layout.png" alt="Diagram of a two-lane road section where an on-ramp joins a freeway; an acceleration lane runs from point O to point P, a merging car aims for point M, and the lag gap and lead gap between two freeway cars are marked" loading="lazy" />
  <figcaption>The merging problem. A car from the ramp travels along the acceleration (auxiliary) lane from O to P and has to pick a merging point M where the gap behind (lag gap) and in front (lead gap) are long enough. Yellow cars are autonomous, blue cars are driven by people. From the authors' figure deck.</figcaption>
</figure>

We followed one merging car through the whole episode using a time-space diagram and Newell's simplified car-following model. The merge plays out in four stages: the car waits for a gap on the auxiliary lane, cuts in and forms a queue behind it, keeps accelerating on the freeway, and finally reaches cruising speed so the queue behind it can dissolve. Freeway traffic, in turn, passes through four states: normal flow, a stretch where no car can pass the slow merger, a queue, and the queue discharging at full capacity.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/merging-stages-time-space.png" alt="Left, a sketch of the freeway lane and auxiliary lane with points D, O, M, A and P. Right, a time-space diagram with a thick red trajectory of the merging car and shaded areas in blue, white, orange and green" loading="lazy" />
  <figcaption>One merging episode in a time-space diagram (time to the right, distance up). The red line is the merging car. Orange is the queue that forms behind it, white is the gap in front of it where no freeway car can pass, and green is the queue dissolving once the car reaches freeway speed at point A. The episode then repeats with the next merging car (right). From the paper.</figcaption>
</figure>

We then turned this into a merging controller. At each time step the AV decides whether to take the gap in front of it and how hard to accelerate. Each choice is scored on two things: the **delay** it causes freeway traffic, computed from the queue, and the **crash risk**, measured by how hard the following cars would need to brake to avoid a collision (the deceleration rate to avoid a crash, DRAC). A weight lets an agency put more emphasis on efficiency, on safety, or on both equally. Because the end state is known (the car is on the freeway at full speed), the problem can be solved exactly by dynamic programming, working backward from the end of the lane.

## What is the key methodological contribution?

The core result is a closed-form formula for the effective discharge rate at a merge:

**effective discharge rate = capacity × (1 − θ)**

The capacity discount θ grows with the arrival rate, the share of traffic coming from the ramp, and the square of the speed difference between the freeway and the merging car. It shrinks when cars can accelerate faster. In plain words: the slower merging cars are when they cut in, and the more of them there are, the more capacity the freeway loses.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/queue-effective-discharge.png" alt="Two stacked charts. Top: a hump-shaped demand curve crosses a flat purple maximum discharge rate line and a lower dashed blue effective discharge rate curve. Bottom: the queue under the dashed blue curve grows higher and lasts longer than the queue under the purple line" loading="lazy" />
  <figcaption>Why the discount matters. Top: the classic model lets traffic out at the full capacity (purple line), but merging cars hold the real outflow lower (dashed blue). Bottom: the real queue (dashed blue) grows longer and takes longer to clear than the classic model predicts (purple), so delay is underestimated. From the paper.</figcaption>
</figure>

Two ideas made the formula possible:

1. **A "barrel effect".** A barrel holds only as much water as its shortest stave allows; a merge area passes only as many cars as its tightest point allows. We checked every possible reference point along the merge area and showed that the outflow is lowest along the stretch where the merging car is still accelerating on the freeway. That is where we measure the discount.
2. **The reference point cancels out.** Along that stretch, the exact location drops out of the derivation, leaving a formula that depends only on quantities an agency can measure or an AV can control: traffic demand, ramp share, freeway speed, merging speed and acceleration.

The formula also shows that the outflow never decreases as merging speed rises, which agrees with what we observed in the field.

## What are the key findings?

**The formula matches the field.** We tested it on NGSIM vehicle trajectories from northbound I-80 in California (April 13, 2005), on a 500 m section with a 43 m auxiliary lane. From the trajectories we measured a backward wave speed of 19 km/h, a jam density of 113 vehicles per lane per km and a cruising speed of 48 km/h, which gives a theoretical capacity of 1,538 vehicles per hour.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/ngsim-i80-study-area.png" alt="Schematic of the I-80 study area: lane 6 on the freeway, lane 7 as the on-ramp, a 43 m auxiliary lane, and an outflow observation point 213 m downstream" loading="lazy" />
  <figcaption>The I-80 study area. Ramp cars (lane 7) merge into freeway lane 6 along a 43 m auxiliary lane; outflow is counted 213 m downstream, where merging cars have finished accelerating. From the paper.</figcaption>
</figure>

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/ngsim-i80-trajectories.png" alt="Dense time-space plot of vehicle trajectories in freeway lane 6, with red trajectories for merging vehicles and three boxes labeled A, B and C marking backward-moving shockwaves" loading="lazy" />
  <figcaption>Trajectories in freeway lane 6 from 4:00 to 4:15 pm, with merging vehicles in red. Boxes A, B and C mark shockwaves travelling back upstream at 16 to 22 km/h, the slow-downs that merging cars set off. From the paper, NGSIM data.</figcaption>
</figure>

- From 4:00 to 4:15 pm, 280 vehicles passed the downstream point in freeway lane 6, an outflow of **1,120 vehicles per hour**. Our formula predicted **1,174**, an error of **4.8%**. Using the fixed capacity of 1,538 would have been off by **37.3%**.
- From 5:00 to 5:30 pm, the observed outflow was 1,294 vehicles per hour and the formula predicted 1,230, an error of **4.9%**, against **18.9%** with the fixed capacity.

**Ignoring the discount underestimates delay.** In a simulated on-ramp (600 m section, 150 m auxiliary lane, 1,600 vehicles per hour with 15% from the ramp, 1,000 random runs), planning with the fixed capacity instead of the effective discharge rate underestimated delay by about 4% (115 versus 120 vehicle-seconds), while the crash risk estimate barely changed.

**Smarter merging beats both common rules.** Compared with merging into the first acceptable gap, our controller cut delay and crash risk by **13.7% to 19.7%**. Compared with always merging at the end of the lane, it cut them by **6.9% to 8.6%**. This held whether the controller was told to favor efficiency, safety, or both.

<figure>
  <img src="/media/tang-freeway-merging-tits-2025/sensitivity-demand.png" alt="Line chart of average cost reduction against traffic demand from 1,200 to 2,200 vehicles per hour; red lines compare with early merging and blue lines with late merging, all at or above zero" loading="lazy" />
  <figcaption>How much our controller saves as traffic grows, compared with early merging (red) and late merging (blue), for an efficiency goal (solid), a safety goal (dashed) or both (dotted). The savings never drop below zero. In light traffic, gaps are easy to find and merging early is already the best choice; above about 1,400 vehicles per hour, early merging starts to cost real delay. From the paper.</figcaption>
</figure>

The advantage held across every test we ran:

- **Traffic demand** from 1,200 to 2,200 vehicles per hour: cost savings of up to 22.1% against early merging and 0.5% to 15.2% against late merging. As demand rises, gaps become scarce and the best plan increasingly looks like late merging.
- **Auxiliary lane length** from 100 to 200 m: savings of 12.1% to 56.3% against early merging and up to 10.7% against late merging. Longer lanes give the car more chances to merge safely at full speed.
- **Share of ramp traffic** from 5% to 20%: savings of 11.3% to 18.9% against early merging and 4.1% to 9.3% against late merging, growing as more cars merge.

<figure class="figure-row">
  <img src="/media/tang-freeway-merging-tits-2025/sensitivity-aux-lane-length.png" alt="Line chart of average cost reduction against auxiliary lane length from 100 to 200 m; the red safety-oriented line rises sharply above 150 m" loading="lazy" />
  <img src="/media/tang-freeway-merging-tits-2025/sensitivity-ramp-share.png" alt="Line chart of average cost reduction against the share of ramp traffic; all lines rise slightly as the share grows" loading="lazy" />
  <figcaption>Left: savings as the auxiliary lane gets longer. Against early merging, the safety benefit jumps once the lane exceeds 150 m. Right: savings as a larger share of traffic comes from the ramp. From the paper.</figcaption>
</figure>

## What can this be used for?

- **AV and connected-vehicle developers**: a merging policy that is grounded in traffic flow theory, weighs delay and safety explicitly, and can be tuned with a single weight.
- **Traffic operations and planning**: a quick way to estimate how much capacity a merge really has, given ramp volume and merging speed, instead of assuming the textbook capacity. That gives more realistic queue and delay estimates when evaluating on-ramp operations.
- **Ramp design**: the results quantify how auxiliary lane length changes what merging strategy is best and how much safety it buys.

The study controlled one autonomous car merging into one freeway lane, with each AV deciding on its own. Next steps include cooperation among connected and automated vehicles and multi-lane freeways, where the number of possible states grows much larger. The same modeling approach builds on our earlier closed-form discharge rates for bus-only lane conversion and roundabout merging.
