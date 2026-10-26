---
tldr: >-
  A driverless work-zone truck (ATMA) crawls along at 5-15 mph and slows the traffic behind it, so
  the route it takes through a network matters. We built a traffic assignment model that captures
  this moving bottleneck, and on the Sioux Falls test network the best route added 0.91% to
  network-wide travel time, against 1.11% for the shortest route and 1.25% for the worst.
hero:
  video: /media/tang-atma-route-optimization-ai-2026/atma-traffic-loop.mp4
  poster: /media/tang-atma-route-optimization-ai-2026/atma-traffic-loop-poster.jpg
  loop: true
  alt: Drone view of a driverless follow truck with a yellow crash cushion trailing a striping truck down a multilane road, with an inset of its empty cab and a 6 MPH readout
  caption: >-
    An ATMA follow truck with no one in the cab (inset, reading 6 MPH) trails a striping truck. At
    this pace it acts as a moving bottleneck, and the route it takes decides which drivers get
    delayed.
  credit: Royal Truck & Equipment
abstract: |-
  The emerging technology of the Autonomous Truck Mounted Attenuator (ATMA), a leader-follower style vehicle system, leverages connected and automated vehicle capabilities to enhance safety during transportation infrastructure maintenance in work zones. However, ATMA vehicles, due to their significantly lower speed compared to regular vehicles, create moving bottlenecks that reduce roadway capacity and increase queue lengths, leading to additional delays. The different routes taken by ATMA result in varied patterns of time-varying capacity drops, which can affect the user equilibrium traffic assignment and lead to different system costs. This manuscript aims to optimize the routing for ATMA in a network to minimize the system cost associated with their slow-moving operation.

  To achieve this, a queuing-based traffic assignment approach is proposed to quantify the system cost incurred by ATMA on a specific route. A queuing-based time-dependent (QBTD) travel time function, which considers capacity drop, is introduced and applied to the static user equilibrium traffic assignment problem (TAP), adding dynamic characteristics. The queuing-based TAP is then formulated and solved using a modified path-based algorithm. The methodology is validated using both small and large networks and is compared with two benchmark models to assess the benefits of capacity drop modeling and the QBTD travel time function. Furthermore, the approach is applied to evaluate the impact of different routes on the network and to identify an optimal route for ATMA during maintenance work. Finally, sensitivity analysis is conducted to explore how the impact changes with variations in traffic demand and capacity reduction.
key_numbers:
  - { value: "0.91%", label: "extra network-wide travel time on the best ATMA route, vs 1.11% on the shortest route" }
  - { value: "10", label: "candidate ATMA routes compared on the Sioux Falls network (24 nodes, 75 links)" }
  - { value: "0.02%", label: "average equilibrium gap of our model, vs 0.43% when the capacity drop is ignored and 11.78% with the standard BPR function" }
  - { value: "0.29–0.41%", label: "extra travel time when the ATMA works at 20 mph, down from 0.91–1.25% at 10 mph" }
updated: 2026-10-26
---

## What problem does this research solve?

The **Autonomous Truck Mounted Attenuator (ATMA)** takes highway workers out of harm's way. A human-driven lead truck does the maintenance work, such as striping or sweeping, and a driverless follow truck shadows it, carrying a crash cushion that absorbs the impact if a car runs into the back of the operation. Colorado and Missouri DOTs, among others, have pioneered its use (see our [field-testing study](/av-atma-field-testing-trr-2021/)).

But safety for workers has a cost for everyone else. The ATMA typically works at **5-15 mph**. On a multilane road, the vehicles behind it must slow down and squeeze past in the remaining lanes, so the truck pair acts as a **moving bottleneck** that cuts the road's capacity while it is there. Queues grow, delays spread, and when the work is announced in advance, some drivers switch to other routes, which loads other roads.

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/moving-bottleneck.png" alt="Diagram of a two-lane, one-direction highway: a lead and a follow truck travel slowly in the right lane at speed v-ATMA, separated by a gap, while a red car behind them changes into the left lane to pass" loading="lazy" />
  <figcaption>The moving bottleneck. The two ATMA trucks (red box) travel at a fraction of the cruising speed, so cars behind them (red) must merge into the remaining lane to get by. From the paper.</figcaption>
</figure>

When several road segments need maintenance, the agency has to decide **in what order, and along which path, the ATMA should visit them**. Common sense says take the shortest path. But the shortest path may run the slow truck through the busiest roads at the busiest times. Until now there was no network-level method for choosing an ATMA route that keeps the total delay to the traveling public as low as possible.

## What did we do?

We treat route choice for the ATMA as a two-level problem:

- **Upper level (the agency):** try each candidate ATMA route that covers all the segments to be maintained, and keep the one with the lowest *system cost*, defined as the extra total travel time of all drivers in the network compared with no maintenance at all.
- **Lower level (the drivers):** for a given ATMA route, work out how traffic redistributes. Each driver picks their fastest path, and the model finds the resulting *user equilibrium*, the state where no driver can save time by switching routes. This must account for the capacity loss moving through the network with the ATMA, minute by minute.

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/bilevel-framework.png" alt="Flowchart: the higher level selects a potential ATMA route and updates the time-dependent capacity reduction; the lower level iterates queuing-based travel times, shortest-path updates and gradient projection until convergence; the best route so far is kept until all routes have been examined" loading="lazy" />
  <figcaption>The two-level framework. For each candidate ATMA route, the lower level (dashed box) finds how drivers re-route under the time-varying capacity loss; the upper level keeps the route with the lowest total cost. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

Standard planning models (static traffic assignment) are fast and well understood, but they use a fixed link travel-time curve, such as the Bureau of Public Roads (BPR) function, which cannot represent a queue that builds up and drains while a slow truck passes. Dynamic traffic assignment can, but it is slow and often lacks convergence guarantees. We bridge the two:

1. **How much capacity the ATMA takes away.** Following Newell's moving-bottleneck theory, we look at the road from the point of view of an observer riding along with the ATMA. From there, the two-lane road looks like a fixed one-lane bottleneck, which gives a closed-form expression for the reduced capacity as a function of the ATMA speed, the cruising speed and the traffic wave speed.
2. **A queue-based, time-dependent travel time.** Each road segment's travel time is its free-flow time plus the delay of the queue that forms when arrivals exceed the (temporarily reduced) discharge rate. We prove this travel time satisfies first-in-first-out, so vehicles cannot overtake each other through the queue.
3. **A solution algorithm.** We plug this travel time into the classic equilibrium formulation and modify a path-based algorithm (gradient projection) to solve it at every time step, giving a dynamic equilibrium while keeping much of the efficiency and tractability of static assignment.

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/queue-formation.png" alt="Two charts over time: left, a hump-shaped demand curve crossing a flat maximum discharge rate, with the excess shaded red and the recovery shaded green; right, the queue length rising from t0, peaking at t2 and returning to zero" loading="lazy" />
  <figcaption>How the queue is modeled. Left: while demand (black curve) exceeds the discharge rate (flat line), vehicles pile up (red area). Right: the queue grows until demand falls back below capacity, then drains. When the ATMA is on the segment, the discharge rate drops and the queue lasts longer. From the paper.</figcaption>
</figure>

## What are the key findings?

**1. Ignoring the moving bottleneck sends traffic to the wrong places.** On a small test network (two paths, 6,000 vehicles per hour, ATMA at 3.5 m/s on the direct path for 460 s), our model stayed at equilibrium throughout. A model that ignores the capacity drop drifted to a 60% gap from equilibrium while the ATMA was working, and a BPR-based model reached 82%. On the larger Sioux Falls network, the average gap was **0.02%** for our model, **0.43%** without the capacity drop and **11.78%** with the BPR function.

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/small-network-gap.png" alt="Line chart of relative gap over 600 seconds: the proposed model stays at 0%, the capacity-drop-ignored model rises to about 60% then falls to 40%, and the BPR-based model climbs to about 80%" loading="lazy" />
  <figcaption>Gap from equilibrium over time on the small network (lower is better). Only our model (blue) keeps traffic at equilibrium while the ATMA is working. From the paper.</figcaption>
</figure>

**2. The shortest route is not the best route.** On the Sioux Falls network, the ATMA had to maintain four links (red below), starting from node 6 and ending at node 14, working at 10 mph while regular traffic cruised at 60 mph. Without the ATMA, all drivers together spend 5,656,962 hours in the 5-hour study period. Across the 10 shortest candidate routes, the ATMA added between **0.91%** (Path 9) and **1.25%** (Path 10) to that total. The shortest route, Path 1, added **1.11%**. Longer routes are not necessarily worse: what matters is *which* roads the ATMA slows down, and *when*.

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/sioux-falls-network.png" alt="Sioux Falls test network of 24 nodes and numbered links, with four links highlighted in red and the traffic origin-destination nodes in green" loading="lazy" />
  <figcaption>The Sioux Falls test network. The ATMA must maintain the four red links; green nodes are where trips start and end. From the paper.</figcaption>
</figure>

<figure>
  <img src="/media/tang-atma-route-optimization-ai-2026/route-cost.png" alt="Chart over path IDs 1 to 10: system cost (solid blue, left axis, about 51,500 to 70,000 hours) zigzags, while path travel time (dashed orange, right axis, 228 to 288 minutes) rises steadily" loading="lazy" />
  <figcaption>For the 10 candidate routes, the ATMA's own travel time (dashed orange) rises steadily, but the cost to all other drivers (solid blue) does not follow it. Paths 2, 7 and 9 cost least. From the paper.</figcaption>
</figure>

**3. The best route holds up when conditions change.** With 10%, 20% and 30% more traffic, the extra travel time from the ATMA ranged from 0.60% to 1.09%, and Paths 9 and 2 stayed the least disruptive. Raising the ATMA speed from 10 to 15 and 20 mph shrank the extra travel time from 0.91-1.25% to **0.49-0.68%** and **0.29-0.41%**, and narrowed the differences between routes. Where the work allows it, operating faster is itself a way to reduce traffic impact.

<figure class="figure-row">
  <img src="/media/tang-atma-route-optimization-ai-2026/demand-sensitivity.png" alt="Additional total travel time in percent for paths 1 to 10 under original demand and plus 10, 20 and 30 percent; all four lines dip at paths 2, 7 and 9" loading="lazy" />
  <img src="/media/tang-atma-route-optimization-ai-2026/speed-sensitivity.png" alt="Additional total travel time in percent for paths 1 to 10 at ATMA speeds of 10, 15 and 20 mph; the lines drop from about 1.1% to about 0.6% and 0.35%" loading="lazy" />
  <figcaption>Extra network travel time by route. Left: as traffic demand grows (original to +30%). Right: as the ATMA works faster (10, 15, 20 mph). The low points at Paths 2 and 9 persist in every case. From the paper.</figcaption>
</figure>

## What can this be used for?

- **DOT maintenance planners**: compare candidate ATMA routes and schedules before a mobile operation is announced, and pick the one that disrupts the public least, rather than simply the shortest.
- **Traffic operations and public information**: anticipate where drivers will divert and where queues will form while the ATMA is on the road.
- **Transportation modelers**: the queue-based, time-dependent travel time could be adapted to other situations where road capacity changes over time, such as other slow-moving operations or temporary lane closures.

The study has limits. Traffic flow is assumed constant within each time step, and very large networks may need further computational work. The model was tested on the Sioux Falls benchmark network rather than a real agency network.
