---
tldr: >-
  We derived simple closed-form formulas for how much capacity a road loses when cars enter from a
  side street or ramp and have to cross a bus-only lane, and used them to schedule when the bus lane
  should be switched on and off. The formulas cut the capacity error against NGSIM field data from
  15.0% to 6.6% on an arterial, and the optimized schedule cut total delay by 43% to 48% compared with
  running the bus lane for the whole peak hour.
hero:
  image: /media/tang-bus-lane-discharge-trb-2021/bus-lanes-la-beijing.jpg
  alt: Two photos side by side. Left, a city street in downtown Los Angeles with a bus in a curbside lane marked BUS LANE. Right, a bus and many cars on Beijing's 3rd Ring Road.
  caption: >-
    Bus-only lanes on 5th Street in downtown Los Angeles (left) and on Beijing's 3rd Ring Road, an urban
    freeway (right). The bus lane is the right-hand lane, so every car entering from a side street or on-ramp
    has to cross it, and each one slows the traffic around it.
  credit: From the paper
affiliations:
  - Missouri University of Science and Technology
  - Arizona State University
author_affiliations: [[1], [1], [2], [2]]
abstract: |-
  An accurate quantification of traffic flow characteristics with and without bus-only lane is important for determining transit priority strategies. Examinations of real-world vehicle trajectory data, like those from the NGSIM dataset, found that an effective discharge rate may be discounted when merging or lane-changing behaviors are observed. To deal with this, this manuscript analytically derives the effective discharge rate of a roadway segment by considering multi-stage merging behavior and vehicular traffic kinematics near a side entrance, for optimal bus-only lane conversion. The classic fluid-based approximation model by Newell that characterizes the queuing and dissipation process is extended to a multi-state queuing analysis framework. Three effective discharge rate discount factors are explicitly derived, for bus-only lane, general-purpose lane, and mixed-traffic lane, respectively. The derived effective discharge rates are represented by mathematically-simple expressions in a closed-form, and correctly account for the effects of demand inputs, such as arrival rate and the ratio of vehicles of different types, vehicular performance (such as acceleration rate), and traffic flow characteristics (such as backward wave speed and jam density). The bus-only lane conversion scheduling problem is then formulated as an optimization model to minimize total traffic delay. Validation, using NGSIM data, showed that our model reduced the effective discharge rate estimation error significantly on both arterials and freeways. Sensitivity analysis revealed that the optimal bus-only lane scheduling time varied in response to traffic demand and vehicle ratios, and the developed optimization model was always beneficial when compared with the demand-oriented strategy.
key_numbers:
  - { value: "43.0%", label: "less total delay on an arterial than running the bus lane for the whole peak hour" }
  - { value: "48.2%", label: "less total delay on a freeway, same comparison" }
  - { value: "6.6%", label: "error of the estimated road capacity against NGSIM data on Lankershim Boulevard, down from 15.0% with a fixed capacity" }
  - { value: "34.0%", label: "of arterial delay missed if the capacity lost to entering cars is ignored" }
updated: 2026-10-27
---

## What problem does this research solve?

Many cities turn the right-hand lane of a busy street or freeway into a **bus-only lane** at certain times of day. It speeds up buses, but it takes a lane away from cars, which can mean longer queues and more delay for everyone else. A common rule is simple: switch the bus lane on during the peak hours and off the rest of the day. Is that the best schedule? Answering that question needs a reliable estimate of how many vehicles each lane can actually carry, with and without the bus lane.

Traffic engineers usually treat that number, the road's **capacity** or maximum **discharge rate**, as a fixed value read from the fundamental diagram of traffic flow. Real vehicle trajectories say otherwise. When a car cuts into a lane, the driver behind it slows down to keep a safe distance and then falls back. Even after the car moves on, the gap often never closes again, and that unused road space is lost capacity.

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/lane-changer-headway.png" alt="Two time-space diagrams of many vehicle trajectories drawn as thin lines. In each, two thick black trajectories are a leader and a follower, and a short purple line is a car that cuts in between them and leaves again" loading="lazy" />
  <figcaption>Two examples from NGSIM vehicle trajectories (time to the right, distance up). A car cuts in between a leader and a follower (purple) and later leaves the lane. The follower's time gap grows from the small h<sub>bef</sub> to a much larger h<sub>aft</sub>, and the white space between the two black lines, road time that carries no traffic, widens. From the paper, NGSIM data.</figcaption>
</figure>

A bus lane makes this worse in a specific way. It sits on the far right, where side streets, driveways, shopping-mall exits and on-ramps join the road. A car entering from one of them must first wait for a gap, then pull into the bus lane, accelerate, and change lanes again into the general traffic lane. Each step slows someone down. Until this study there was no simple formula for how much capacity those entering cars take away, so the effect could not be built into a decision about when to run a bus lane.

## What did we do?

We studied a two-lane road with one side entrance, in two versions: an **arterial**, where the side street has a stop sign and entering cars start from a standstill, and a **freeway**, where cars enter from a yield-controlled on-ramp already moving.

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/bus-lane-scenario.png" alt="Diagram of a two-lane road. The upper lane is labeled General Vehicle Only and the lower lane Bus Only. A car enters from a side entrance at point A, merges into the bus lane at B, moves along it to C prime, then crosses into the general lane and reaches point C" loading="lazy" />
  <figcaption>The setup with the bus lane switched on. A car arrives at the side entrance (A), waits for a gap, merges into the bus lane (B), accelerates along it, crosses into the general lane (C′) and reaches cruising speed (C). It is not allowed to drive along the bus lane at full speed. From the paper.</figcaption>
</figure>

We followed one entering car through this **multi-stage** process and asked what it does to traffic in each lane. While it accelerates, the car is a slow **moving bottleneck**: buses behind it in the bus lane, and later cars behind it in the general lane, queue up and cannot pass. Once it is up to speed, the queue behind it dissolves. The pattern repeats each time a new car arrives at the side entrance. Averaging over one such cycle gives the **effective discharge rate**, the number of vehicles a lane really lets through per hour.

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/multi-stage-time-space.png" alt="Two time-space diagrams. Left, the bus-only lane: a red trajectory of the entering car accelerates from points B to C prime, and dashed lines show a queue forming behind it and then dissipating. Right, the general-purpose lane: the red trajectory accelerates from C prime to C with a similar queue behind it" loading="lazy" />
  <figcaption>One cycle in time-space diagrams. Left, the bus lane: buses queue behind the entering car (red) while it accelerates from B to C′, and the queue dissipates after it leaves. Right, the general lane: cars queue behind it from C′ until it reaches cruising speed at C, then that queue dissipates too. The cycle restarts with the next entering car. From the paper.</figcaption>
</figure>

We then used these discharge rates to choose the bus-lane schedule. Queues grow whenever more vehicles arrive than the road can discharge, and total delay is the area under the queue over time. We wrote the total delay of buses and cars over the analysis period as a function of two decisions, **when to switch the bus lane on and when to switch it off**, and picked the pair that gives the least delay. The queue carries over when the lane switches mode, so a queue built up while the bus lane is on still has to clear afterward.

## What is the key methodological contribution?

The main result is three formulas, all of the same shape:

**effective discharge rate = maximum discharge rate × (1 − discount)**

There is one discount for the **bus lane** and one for the **general lane** when the bus lane is on, and one for the **mixed-traffic lanes** when it is off, each in an arterial and a freeway version. Every discount is closed-form: an agency can compute it from the arrival rate, the share of vehicles entering from the side, cruising speeds, the backward wave speed and how fast entering cars accelerate. No simulation and no equation-solving is needed, unlike earlier capacity-drop models.

<figure class="figure-narrow">
  <img src="/media/tang-bus-lane-discharge-trb-2021/queue-effective-discharge.png" alt="Two stacked charts. Top, a hump-shaped demand curve rises above a flat maximum discharge rate line between t0 and t2, with a dashed blue effective discharge rate curve dipping below that line. Bottom, the queue length grows from t0, peaks at t2, and falls to zero at t-bar" loading="lazy" />
  <figcaption>Why the discount matters. Top: when demand (black curve) exceeds what the road can discharge, a queue builds up (red area) and later clears (green area). The classic model uses a fixed maximum discharge rate μ (flat line); the real, effective rate μ′ (dashed blue) is lower and varies with traffic. Bottom: the queue keeps growing until t<sub>2</sub>, the end of the peak, and is still long after it, so switching the bus lane off exactly when the peak ends is not obviously right. From the paper.</figcaption>
</figure>

The hardest case is the road **without** a bus lane. There, the entering car slows down the right lane, while traffic behind it can still squeeze past in the left lane. We built on Newell's theory of moving bottlenecks, which explains this for a slow truck at constant speed, by looking at traffic from the point of view of an observer riding along with the slow car. Our car is different because it keeps accelerating, so the bottleneck weakens every second. We tracked how the passing flow grows as the car speeds up and averaged it over the acceleration phase, which led to a closed-form result for this case too.

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/moving-bottleneck-fd.png" alt="Left, a triangular flow-density diagram drawn twice, in black for a stationary observer and in red for an observer moving with the entering car, with labeled points F, H and M. Right, a 3D surface plot of flow against density and moving bottleneck speed" loading="lazy" />
  <figcaption>The moving-bottleneck analysis. Left: the flow-density diagram as seen by a stationary observer (black) and by an observer moving with the entering car (red), which gives the flow that can pass the slow car at one instant. Right: as the car's speed rises (front axis), the flow that gets past it rises too; we average over this whole acceleration. From the paper.</figcaption>
</figure>

The formulas also make the drivers of lost capacity explicit:

- The discount grows with **traffic demand** and with the **share of cars entering** from the side.
- Entering cars cost more capacity on an **arterial**, where they start from a stop, than on a **freeway**, where they enter already moving.
- Cars that **accelerate faster** cost less capacity.
- When the bus lane is on, the general lane loses less capacity the closer the bus-lane and general-lane speeds are: more uniform traffic avoids sharp drops in discharge.

## What are the key findings?

**The formulas match field data.** We checked them against NGSIM vehicle trajectories from two places: Lankershim Boulevard in Los Angeles, with a side entrance between two signalized intersections (arterial), and northbound I-80 in Emeryville, California, with an on-ramp and a 43 m acceleration lane (freeway).

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/ngsim-study-areas.png" alt="Two schematics. Top, Lankershim Boulevard with lanes 1 and 2 between intersections 1 and 2 and a side entrance. Bottom, a 503 m stretch of northbound I-80 with lanes 5 and 6, an on-ramp with a 43 m acceleration lane, and an outflow observation point" loading="lazy" />
  <figcaption>The two NGSIM test sites: Lankershim Boulevard in Los Angeles (top) and northbound I-80 in Emeryville, California (bottom). On I-80, outflow is counted far enough downstream that merging cars have finished accelerating. From the paper.</figcaption>
</figure>

- **Lankershim Boulevard**: the textbook maximum discharge rate is 3,086 vehicles per hour, while the road actually discharged 2,684. Our formula gave 2,861, cutting the error from **15.0% to 6.6%**.
- **I-80**: across three 15-minute periods in the afternoon, the error fell from 33.2%, 20.8% and 19.4% with the fixed capacity to **23.3%, 12.4% and 10.6%** with our formula. From 4:00 to 4:15 pm the observed outflow was 2,316 vehicles per hour, far below the textbook value; with a fixed capacity, the model would wrongly point to free-flow conditions.

**A smarter schedule beats peak-hour bus lanes.** In a three-hour test, demand rose from 1,000 to 2,500 vehicles per hour for the middle hour and then fell back; 15% to 20% of vehicles were buses and 5% entered from the side.

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/delay-peak-vs-optimized.png" alt="Bar chart of total delay. Arterial: 500 vehicle-hours with the bus lane on for the whole peak hour, 285 with the optimized schedule, a 43.0 percent cut. Freeway: 423 versus 219, a 48.2 percent cut" loading="lazy" />
  <figcaption>Total delay of all vehicles over the three hours. Running the bus lane for the whole peak hour (grey) against the optimized schedule (blue), both computed with our effective discharge rates. The best schedule switches the lane on about half an hour into the peak (1.52 h) and off before the peak ends: at 1.85 h on the arterial and 1.77 h on the freeway. Chart drawn from the numbers in the paper's Table 2.</figcaption>
</figure>

- The optimized schedule cut total delay by **43.0%** on the arterial (500 to 285 vehicle-hours) and **48.2%** on the freeway (423 to 219).
- In this example, running the bus lane for the whole peak hour caused more delay than never converting the lane at all (331 vehicle-hours on the arterial, 257 on the freeway). The timing of a bus lane matters as much as whether there is one.
- **Ignoring the capacity lost to entering cars gives the wrong answer.** With the textbook capacity, the model picks a shorter window (1.52 to 1.73 h) and predicts only 188 vehicle-hours of delay, underestimating the real delay by **34.0%** on the arterial and **14.2%** on the freeway.

**The best schedule depends on traffic.** Sensitivity tests on the arterial showed the optimized schedule was always better than the peak-hour rule, and that the right window moves with conditions:

<figure>
  <img src="/media/tang-bus-lane-discharge-trb-2021/sensitivity-arrival-rate.png" alt="Four line charts. Top left, bus lane start and end times against peak arrival rate from 2,500 to 4,000 vehicles per hour, where the blue dashed end time rises steadily. Top right, total delay and percentage curves against peak arrival rate. Bottom row, the same against off-peak arrival rate from 500 to 2,000 vehicles per hour" loading="lazy" />
  <figcaption>How the best schedule and delay change with demand. Top: as the peak arrival rate grows from 2,500 to 4,000 vehicles per hour, the best switch-on time stays near 1.5 h but the switch-off time moves from 1.85 h to 2.65 h, well after the peak (blue dashed line, top left), and all delays rise (top right). Bottom: the same for off-peak demand. Red lines use the textbook capacity, blue lines our effective discharge rate. From the paper.</figcaption>
</figure>

- **Heavier peak traffic** keeps the bus lane on longer, past the end of the peak. Across the peak-demand tests the optimized schedule saved 23% of delay on average against the peak-hour rule, and ignoring the capacity loss underestimated delay by 31% on average.
- **More cars entering from the side** (1% to 10% of traffic) lengthens the best bus-lane window from 0.25 h to 0.48 h. With the textbook capacity, the schedule does not react at all, and the delay estimate is off by up to 54%.
- **More buses** (5% to 25% of traffic) lengthens the window from 0.24 h to 0.76 h, and the gain from optimizing shrinks from 62% to 9%.

## What can this be used for?

- **Transit agencies and city traffic departments**: a quick, transparent way to decide when a part-time bus lane should run, based on measured demand, bus share and side-street traffic, instead of a fixed peak-hour window.
- **Capacity analysis**: the discount formulas give a realistic capacity for any road segment where vehicles merge from a side entrance, using quantities that are easy to measure, so queue and delay estimates are not overly optimistic.
- **Other merge problems**: the same approach applies wherever merging traffic eats into capacity, for example at the entrances and exits of HOV lanes, or in planning how connected and automated vehicles should merge so they disturb main-road traffic less.

We later extended this modeling to on-ramp merging by autonomous vehicles; see our page on [freeway merging control](/tang-freeway-merging-tits-2025/).
