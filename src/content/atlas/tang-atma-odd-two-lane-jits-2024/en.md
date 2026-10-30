---
tldr: >-
  A driverless work-zone truck (ATMA) crawls along at 5-15 mph, so on a two-lane highway drivers
  queue behind it until a gap in oncoming traffic lets them pass. We built a queuing model of that
  passing process, and it shows that on a typical rural highway an ATMA keeps traffic at level of
  service C as long as the road carries fewer than about 11,000 vehicles a day.
hero:
  image: /media/tang-atma-odd-two-lane-jits-2024/two-lane-queue.png
  alt: Diagram of a two-lane highway, one lane each way. In the lower lane, a lead truck (LT) and a driverless follow truck (FT) travel slowly with a gap between them; three cars queue behind them inside a red dashed box labeled Platoon, while faster cars approach from behind and oncoming cars use the upper lane.
  caption: >-
    The problem on a two-lane highway. Cars catch up with the slow ATMA pair (LT and FT) and form a
    queue behind it. Only the first car in the queue can pass, and only when the oncoming lane
    (top) has a long enough gap.
  credit: Tang & Hu (2024)
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  As a special application of connected and automated vehicles (CAVs), the Autonomous Truck Mounted Attenuator (ATMA) vehicle system is promoted to reduce fatalities in work zone locations. In this manuscript, we focus on the Operational Design Domain (ODD) problem of two-lane highways, i.e., under what traffic conditions should an ATMA be deployed. Due to the dramatic speed difference between ATMA vehicles and general vehicles, a queue will be formed, leading to a percent-time-spent-following (PTSF) increase during maintenance. General vehicles in the queue will assess a gap on the opposite lane to perform a passing maneuver, which is broken down into multi-stage merging behavior. As such, an analytical model is first made, based on queuing theory in which the arrival rate and service rate are analyzed to estimate the PTSF. In this way, the linkage between annual average daily traffic (AADT) and level of service (LOS) is analytically established. Then, the proposed model is validated by comparing the estimated PTSF with that of the Highway Capacity Manual (HCM) values. The comparison results show that the mean error is 9.58%, and the mean absolute error is 12.36%, which demonstrate that the developed model is able to generate satisfactory results when compared with the HCM model. Numeric analysis also shows that roadway performance is sensitive to the K factor and D factor, as well as the operating speed of an ATMA. If LOS=C is a desirable design objective, a good AADT threshold to use would be around 11,000 vehicles per day.
key_numbers:
  - { value: "11,000", label: "vehicles per day: the AADT below which an ATMA keeps a typical two-lane highway at LOS C" }
  - { value: "6,000", label: "vehicles per day: the AADT limit Colorado DOT had been using for ATMA work" }
  - { value: "8,500", label: "vehicles per day: the threshold drops this low when the ATMA works at 5 mph instead of 15 mph" }
  - { value: "12.36%", label: "mean absolute difference from the Highway Capacity Manual's time-spent-following values" }
updated: 2026-10-27
---

## What problem does this research solve?

The **Autonomous Truck Mounted Attenuator (ATMA)** takes highway workers out of the most dangerous seat in a mobile work zone. A human-driven lead truck does the work, such as striping, sweeping or patching potholes, and a driverless follow truck shadows it about 100-200 ft behind, carrying a crash cushion. If a distracted driver runs into the back of the operation, the empty follow truck takes the hit. Colorado and Missouri DOTs were among the first to use it (see our [field-testing study](/av-atma-field-testing-trr-2021/)).

<figure class="figure-row">
  <img src="/media/tang-atma-odd-two-lane-jits-2024/atma-two-lane-aerial.jpg" alt="Aerial view of a two-lane road with a yellow center line: a yellow-and-white follow truck with a crash cushion on its rear trails a lead truck further down the lane" loading="lazy" />
  <img src="/media/tang-atma-odd-two-lane-jits-2024/atma-follow-truck-rear.jpg" alt="Rear view of a white truck with yellow side rails and a large yellow crash attenuator labeled Nation's first driverless TMA" loading="lazy" />
  <figcaption>Left: an ATMA working on a two-lane road, with the driverless follow truck and its crash cushion in front and the lead truck ahead. Right: the follow truck and its attenuator. Images: Royal Truck &amp; Equipment, from Figure 1 of the paper.</figcaption>
</figure>

<blockquote class="pull-quote">
  <p>The trucks typically move at only 5-15 mph. On a freeway, traffic can slip past in another lane. <strong>On a two-lane highway, with one lane in each direction, it cannot: drivers who catch up with the ATMA have to wait in a line behind it until there is a long enough gap in <em>oncoming</em> traffic to pull out and pass.</strong></p>
</blockquote>

So agencies have to decide **on which roads, and under how much traffic, an ATMA should be used**. In automated-vehicle language this is the system's *operational design domain* (ODD). The Manual on Uniform Traffic Control Devices and other national standards give no guidance, so states have set their own rules. Colorado DOT, for example, used an annual average daily traffic (AADT) of **under 6,000 vehicles** to identify roads suitable for ATMA work. But two-lane highways are much busier in some states than in others, and nobody had a sound way to say whether 6,000 was the right number, or how to derive one.

## What did we do?

We built an analytical model that links the traffic on a two-lane highway (its AADT) to the quality of service drivers experience while an ATMA is working, so an agency can read off the traffic level at which the delay becomes unacceptable.

As the yardstick we used the Highway Capacity Manual's measure for two-lane highways: **percent time spent following (PTSF)**, the share of their trip that drivers spend stuck in a line behind a slower vehicle because they cannot pass. PTSF, together with average travel speed, sets the road's **level of service (LOS)**, graded from A (free flowing) to F. Because no ATMA has been observed on a busy two-lane highway yet, PTSF cannot simply be measured; it has to be predicted.

The key idea is to treat the line of cars behind the ATMA as a **queue at a service counter**:

- **Customers arrive** when faster cars catch up with the back of the line. The slower the ATMA, the faster the line grows.
- **The counter serves one customer at a time.** Only the car directly behind the follow truck can pass, and it is "served" when an acceptable gap appears in the oncoming lane.
- **Time spent following** is the time a car spends in this queue, compared with its time driving freely between queues.

The road also carries ordinary slow trucks (20% of traffic in the study), which create their own queues. The model handles those too and combines both into one PTSF for the whole road.

## What is the key methodological contribution?

Earlier queuing models of two-lane highways were calibrated on field data, such as observed platoon sizes, which do not exist for ATMA operations. Our model derives the passing probability from first principles, by breaking each pass into **three stages** of a lane-change and merge:

1. **Pull out (A to B):** the first car in the queue moves into the oncoming lane at the ATMA's speed.
2. **Overtake (B to C):** it accelerates to cruising speed and drives past the follow truck, the gap between the trucks and the lead truck.
3. **Return (C to D):** it moves back into its own lane ahead of the lead truck.

<figure>
  <img src="/media/tang-atma-odd-two-lane-jits-2024/passing-stages.png" alt="Two-panel diagram of a passing maneuver on a two-lane road. Top: the first car in the queue (red) moves from point A behind the follow truck into the oncoming lane at point B. Bottom: the red car accelerates past both trucks to point C and returns to its own lane at point D; distances L3, S-lt and L2 are marked." loading="lazy" />
  <figcaption>The three stages of passing an ATMA. Adding up the time for each stage gives how long the oncoming lane must be clear; the chance of finding such a gap then sets how quickly the queue is served. From the paper.</figcaption>
</figure>

Adding up the three stages gives the time the oncoming lane must stay clear. With oncoming cars arriving at random, the model computes the chance that the next gap is long enough, and from that how long the first car waits on average. This waiting time is the service time of the queue. Combined with the arrival rate at the back of the line, standard queuing theory (an M/M/1 queue) gives the average time each car spends trapped behind the ATMA, and hence the PTSF, in closed form, for any traffic level.

Before applying it to the ATMA, we checked the model on a case the Highway Capacity Manual (HCM) covers: queues behind an ordinary slow truck, for two-way flows of 500-1,500 vehicles per hour. The model tracks the HCM curve, with a mean absolute difference of **12.36%**. It mostly gives slightly lower values, in line with field studies that found the HCM overestimates PTSF. Above about 1,400 vehicles per hour, passing chances collapse and the model's PTSF rises faster than the HCM's.

<figure>
  <img src="/media/tang-atma-odd-two-lane-jits-2024/hcm-validation.png" alt="Line chart against two-way traffic flow from 500 to 1,500 vehicles per hour: the HCM PTSF (red) rises from 29% to 69%, the proposed model (blue) from 14.5% to 80.6%, and their difference (green, right axis) runs from about -17% up to +11%" loading="lazy" />
  <figcaption>Validation against the Highway Capacity Manual for queues behind ordinary trucks. Our model (blue) follows the HCM values (red), sitting a little lower at light and moderate traffic and crossing above near 1,400 vehicles per hour. From the paper.</figcaption>
</figure>

## What are the key findings?

We applied the model to a typical one-mile rural two-lane highway with a 65 mph cruising speed, the ATMA working at **15 mph** with a 100 ft gap between its trucks, 20% ordinary trucks, and the HCM's typical peak-hour factors.

- **The threshold is about 11,000 vehicles per day.** As AADT rises from 5,000 to 12,000 vehicles per day, the road's overall PTSF climbs from 24.5% to 73.0% and the average travel speed falls from 57 to 42 mph. Taking LOS C as the design target (PTSF no more than 65%, speed no less than 45 mph), the road crosses that line between 11,000 and 11,500 vehicles per day. **11,000 vehicles per day** is a reasonable limit for ATMA work in this scenario, well above the 6,000 Colorado DOT had been using.
- **At light traffic, an ATMA is easier to pass than an ordinary truck.** Because it moves so slowly, a car gets past it quickly. Below about 7,500 vehicles per day, the time spent following behind the ATMA is actually slightly lower than behind a 50 mph truck. But cars also catch up with the ATMA much faster, so as traffic grows its queue takes off: time spent following behind it rises from 22.8% to **97.7%**.

<figure>
  <img src="/media/tang-atma-odd-two-lane-jits-2024/aadt-threshold.png" alt="Chart against AADT from 5,000 to 12,000 vehicles per day: PTSF behind the ATMA (black dashed) rises steeply from about 23% to nearly 98%, PTSF behind ordinary trucks (green dashed) rises gently to about 59%, the combined PTSF (red) reaches the 65% LOS C line near 11,300, and the average travel speed (blue, right axis) falls to the 45 mph LOS C line at about the same point" loading="lazy" />
  <figcaption>Finding the threshold. The road's combined time spent following (red) and its average speed (blue) both cross their LOS C limits (dashed lines) between 11,000 and 11,500 vehicles per day. Behind the ATMA itself (black dashed), following time explodes once traffic passes about 7,500 vehicles per day. From the paper.</figcaption>
</figure>

- **The right threshold depends on the road and the work.** It drops when more of the day's traffic falls in the peak hour: as the K factor rises from 0.09 to 0.12, the threshold falls from 11,500 to **8,500 vehicles per day**. It drops even more steeply when the ATMA slows down: from 11,000 at 15 mph to 10,000 at 10 mph and **8,500 at 5 mph**. A more lopsided directional split (D factor from 0.5 to 0.65) matters less, moving it only from 11,500 to 11,000.

<figure>
  <img src="/media/tang-atma-odd-two-lane-jits-2024/sensitivity-k-speed.png" alt="Two charts of PTSF against AADT with the 65% LOS C line. Left: curves for K factors 0.09 to 0.12, where higher K crosses the line at lower traffic, from about 11,500 down to 8,500. Right: curves for ATMA speeds of 5, 10 and 15 mph, where the 5 mph curve jumps above the line near 8,500 and the 15 mph curve near 11,000." loading="lazy" />
  <figcaption>How the threshold moves. Left: a peakier traffic pattern (higher K factor) lowers it. Right: a slower ATMA lowers it sharply; at 5 mph the queue builds so fast that the 65% line is crossed near 8,500 vehicles per day. From the paper.</figcaption>
</figure>

The model rests on simplifying assumptions: a long, uniform road without entrances, exits or no-passing zones, steady traffic, one car passing at a time, and drivers who always pass when the gap allows. The numbers above are for the typical scenario in the paper; an agency would rerun the model with its own road and traffic data.

## What can this be used for?

- **State DOTs writing ATMA deployment rules**: replace a single statewide AADT cutoff with a threshold derived from the road's own traffic pattern (K and D factors) and the planned operating speed.
- **Maintenance planners**: check before an operation whether a given two-lane highway can absorb an ATMA, or whether to schedule the work off-peak, run it faster where possible, or choose another road segment.
- **Researchers and standards bodies**: the multi-stage passing model is a starting point for ODD guidance on other slow-moving operations, and complements our [route-planning study](/tang-atma-route-optimization-ai-2026/) for ATMA work on road networks.
