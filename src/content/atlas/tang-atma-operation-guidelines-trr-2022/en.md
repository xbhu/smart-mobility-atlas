---
tldr: >-
  In a driverless work-zone convoy (ATMA), the person in the lead truck makes every driving
  decision for two vehicles. Using data from Missouri DOT field tests, we turned classic
  car-following and lane-changing models into practical rules: keep at least 75 ft behind traffic
  ahead and 100-172 ft between the two trucks, wait for a gap of about 912 ft before changing lanes
  on a 70 mph freeway, and allow about 16 seconds to clear an intersection at 10 mph.
hero:
  image: /media/tang-atma-operation-guidelines-trr-2022/lane-change-gap.png
  alt: Diagram of two lanes. In lane 2, a follow truck (FT) and a lead truck (LT) travel with a gap labeled RAD between them, both with arrows pointing into lane 1, and a front vehicle ahead. In lane 1, a lag vehicle is behind and a lead vehicle ahead. Brackets along the top mark L-lag, L-gap and L-lead inside one long span labeled total clear gap plus ATMA vehicles length.
  caption: >-
    Changing lanes with two trucks. Both the lead truck (LT) and the driverless follow truck (FT)
    have to fit into the next lane together, so the opening must cover a safe stopping distance at
    each end, both trucks and the space between them.
  credit: Tang, Hu & Qin (2022)
affiliations:
  - The Pennsylvania State University
  - Stony Brook University
author_affiliations: [[1], [1], [2]]
abstract: |-
  The rapid advancements of connected and autonomous vehicle (CAV) technologies, although possibly years away from wide application to the general public travel, are receiving attention from many State Departments of Transportation (DOT) in a niche area of using Autonomous Maintenance Technology (AMT) to reduce fatalities of DOT workers in work zone locations. Although promising results are shown in testing and deployments in multiple States, current Autonomous Truck Mounted Attenuator (ATMA) system operators are not provided with much practical driving guidance on how to drive this new vehicle systems in a way that is safe to both the public and themselves. To this end, this manuscript aims to model and develop a set of rules and instructions for ATMA system operators, particularly when it comes to critical locations where essential decision making is needed. Specifically, three technical requirements are investigated, including those on car-following distance, critical lane-changing gap distance, and intersection clearance time. Newell's simplified car-following model, and the classic lane-changing behavior model are modified, with roll-ahead distance (RAD) taken into account, to model the driving behaviors of the ATMA vehicles at those critical decision-making locations. Data are collected from real-world field testing to calibrate and validate the developed models. The modelling outputs suggest important thresholds for ATMA system operators to follow. For example, on a freeway with a speed limit of 70 mph and ATMA operating speed of 10 mph, car-following distance should be no less than 75 ft for the lead truck and 100 ft for the follower truck, the critical lane-changing gap distance is 912 ft, and a minimum intersection clearance is 15 seconds, which are all much higher than the requirements for a general vehicle.
key_numbers:
  - { value: "75 ft", label: "minimum distance the lead truck should keep behind the vehicle ahead, at ATMA speeds up to 15 mph" }
  - { value: "100–172 ft", label: "minimum distance between the two trucks, set by how far the follow truck rolls when hit; longer on faster roads" }
  - { value: "912 ft", label: "open gap needed in the next lane to change lanes on a 70 mph freeway (ATMA at 10 mph, trucks 100 ft apart)" }
  - { value: "16 s", label: "to clear an intersection at 10 mph with the trucks 100 ft apart; 22 s when they are 200 ft apart" }
updated: 2026-10-27
---

## What problem does this research solve?

Mobile maintenance work such as striping and pothole patching moves at only **5-15 mph**, much slower than the traffic around it. Drivers who are distracted, speeding or impaired can fail to slow down or change lanes in time, and work zones see tens of thousands of crashes a year: 94,000 nationwide in 2017, with 37,000 injuries and 809 deaths. In Missouri, slow-moving DOT operations had been hit more than 80 times since 2013.

The **Autonomous Truck Mounted Attenuator (ATMA)** takes the worker out of the most exposed seat. A human-driven lead truck does the work; a driverless follow truck, carrying a crash cushion (the attenuator), copies its path and speed a few hundred feet behind, linked by vehicle-to-vehicle radio. If a driver runs into the back of the operation, the empty follow truck takes the hit. Colorado and Missouri were among the first states to deploy it, and our earlier [field-testing study](/av-atma-field-testing-trr-2021/) showed that the follow truck tracks the lead truck reliably.

<figure class="figure-row">
  <img src="/media/tang-atma-operation-guidelines-trr-2022/modot-lead-truck.jpg" alt="An orange Missouri DOT lead truck fitted with GPS antennas and sensors" loading="lazy" />
  <img src="/media/tang-atma-operation-guidelines-trr-2022/modot-follow-truck.jpg" alt="The back of a Missouri DOT follow truck carrying a Scorpion II truck mounted attenuator, with crew members nearby" loading="lazy" />
  <figcaption>The Missouri DOT trucks whose field-test data this study used: the lead truck (left) and the driverless follow truck with its attenuator (right).</figcaption>
</figure>

<blockquote class="pull-quote">
  <p>But the system changes the job of the person in the lead truck. <strong>They now drive for two vehicles.</strong> An ordinary driver changing lanes or turning at a green light only has to fit their own car through. An ATMA driver has to make sure the follow truck, 100 ft or more behind, can get through too; otherwise the convoy is split, with the lead truck in the new lane or across the intersection and the follow truck stranded behind, waiting for its own gap. <strong>Agencies had test results, but operators had almost no practical guidance on how much room and time to leave.</strong></p>
</blockquote>

## What did we do?

We worked out three rules an ATMA operator needs at the moments that call for a decision:

1. **Following distance**: how far the lead truck should stay behind the vehicle ahead, and how far the follow truck should stay behind the lead truck.
2. **Lane-change gap**: how large an opening the next lane must have before both trucks can move over safely.
3. **Intersection clearance time**: how much green time the convoy needs to get both trucks through an intersection.

We adapted two standard traffic-flow models to the two-truck system: Newell's simplified car-following model, in which a follower copies its leader's path with a fixed delay in time and space, and the classic gap-acceptance model of lane changing. We then set the models' parameters with data logged by the trucks during Missouri DOT's field tests in Sedalia, Missouri, in May 2019: the lead truck recorded its position, heading and speed, and the follow truck also recorded its actual distance behind the lead truck.

## What is the key methodological contribution?

Classic models were built for a single car with a human behind the wheel. The ATMA differs in three ways, and each changes the model:

- **No reaction time for the follow truck, but a margin for its accuracy.** A human needs time to notice and react before braking; for the leader we used AASHTO's design value of 2.5 seconds. The follow truck's computer brakes at once, so that term drops out. In its place comes the question of how precisely the system holds the distance the operator sets. From the field logs, the follow truck was within **6 ft** of its target distance 95% of the time.

<figure>
  <img src="/media/tang-atma-operation-guidelines-trr-2022/follow-distance-error.png" alt="Histogram of follow-distance error in feet, from about -5.5 to 8.5, peaking just above zero, with a red smoothed curve" loading="lazy" />
  <figcaption>How precisely the follow truck held its set distance in the field tests. Positive errors mean it was closer to the lead truck than intended; 95% of errors were within 6 ft. From the paper.</figcaption>
</figure>

- **Roll-ahead distance.** When a truck carrying an attenuator is struck from behind, it gets shoved forward. The space between the trucks must be at least this **roll-ahead distance (RAD)**, or the follow truck would be pushed into the lead truck and the worker in it. For a follow truck of this weight (23,365 lb), the AASHTO Roadside Design Guide recommends 100 ft on roads with speed limits under 45 mph, 150 ft at 45-55 mph and 172 ft above 55 mph.
- **The convoy is one unit.** A lane change is only finished when both trucks are in the new lane. So the gap an ordinary car needs (room to stop at the front, room for the car behind to stop, and the car's own length) becomes, for the ATMA, room to stop in front of the lead truck, both 40 ft trucks and the space between them, and room for the car behind the follow truck to stop. The same logic sets the time to clear an intersection: the convoy has not cleared it until the follow truck's tail has.

<figure>
  <img src="/media/tang-atma-operation-guidelines-trr-2022/lane-change-gap-ordinary-car.png" alt="Diagram of two lanes. A single subject vehicle in lane 2 moves into lane 1 between a lag vehicle and a lead vehicle; brackets mark L-lag and L-lead inside a span labeled total clear gap plus vehicle length." loading="lazy" />
  <figcaption>The gap an ordinary car needs to change lanes. Compare it with the diagram at the top of the page: for the ATMA, the middle of the gap must hold two trucks and the distance between them. From the paper.</figcaption>
</figure>

To size the stopping distances, we calibrated the trucks' braking from emergency-stop tests in the field. At 10 mph the trucks stopped in 1.56-1.75 seconds, and at 15 mph in 1.78-2.13 seconds, which gives a maximum deceleration of **12.4 ft/s²**. For the cars around them we used 14.8 ft/s², the rate most drivers stay under when they must stop for an unexpected object.

## What are the key findings?

**Following distance.** The lead truck's minimum distance behind the vehicle ahead grows with speed, from about 20 ft at 5 mph to **75 ft at 15 mph**, so 75 ft covers the whole working range. For the follow truck, braking distance plus the 6 ft accuracy margin stays far below the roll-ahead distance at ATMA speeds, so RAD decides: the trucks should be at least **100 ft** apart on roads under 45 mph, **150 ft** at 45-55 mph and **172 ft** above 55 mph.

<figure>
  <img src="/media/tang-atma-operation-guidelines-trr-2022/leader-truck-min-distance.png" alt="Line chart: minimum following distance of the lead truck rises from about 20 ft at 5 mph to about 75 ft at 15 mph" loading="lazy" />
  <figcaption>Minimum distance the lead truck should keep behind the vehicle ahead, by ATMA speed. At 15 mph, the top of the working range, it reaches 75 ft. From the paper.</figcaption>
</figure>

**Lane changes need a very long gap.** On a freeway where traffic moves at 70 mph, with the ATMA at 10 mph and the trucks 100 ft apart, the next lane needs an opening of about **912 ft**, or about 30 seconds of traffic; with the trucks 200 ft apart, about **939 ft**. Most of it is the room a 70 mph driver behind the follow truck needs to react and stop. On slower roads the gap shrinks, to about 640 ft where traffic moves at 50 mph and 440 ft at 35 mph. A faster ATMA needs a slightly longer gap in feet but a shorter one in seconds, because the convoy finishes the move sooner.

<figure>
  <img src="/media/tang-atma-operation-guidelines-trr-2022/lane-change-results.png" alt="Four line charts against ATMA speed from 5 to 15 mph, for traffic speeds of 35, 50 and 70 mph. Top row, trucks 100 ft apart: critical time headway falls from about 34-47 s at 5 mph to 18-25 s at 15 mph; critical gap distance rises slightly, from about 420-886 ft to 470-940 ft. Bottom row, trucks 200 ft apart: the same patterns, a little higher." loading="lazy" />
  <figcaption>Gap needed to change lanes, in seconds (left) and feet (right), with the trucks 100 ft apart (top) and 200 ft apart (bottom). Each line is a traffic speed; faster traffic (black, 70 mph) needs by far the largest gap. From the paper.</figcaption>
</figure>

These gaps are many times what an ordinary driver looks for, so on busy roads an operator may wait a long time for one. The paper suggests supporting the move with work-zone traffic control such as cones or flaggers, so other drivers do not cut into the gap.

**Intersections need long green times.** We modeled a typical intersection of two four-lane roads, 48 ft across. To get both trucks through, the convoy has to travel the width of the intersection plus both truck lengths and the distance between them. At 10 mph that takes about **16 seconds** with the trucks 100 ft apart and **22 seconds** at 200 ft. Across speeds of 5-15 mph, it ranges from 10-31 seconds (100 ft apart) to 15-45 seconds (200 ft apart). A left turn takes almost exactly as long as going straight. An operator who enters on a late green risks the follow truck being caught in the intersection when the light changes, or cut off by cross traffic.

<figure class="figure-row">
  <img src="/media/tang-atma-operation-guidelines-trr-2022/intersection-layout.png" alt="Plan view of a four-lane intersection. A lead truck and follow truck wait at the stop line with RAD and L-gap marked between them; one path goes straight across a length L-length, another turns left along an arc L-width, with the convoy shown after each move." loading="lazy" />
  <img src="/media/tang-atma-operation-guidelines-trr-2022/intersection-clearance-straight.png" alt="Line chart of time to cross the intersection against ATMA speed from 5 to 15 mph, for distances between the trucks of 100, 150, 172 and 200 ft. Times fall from 31-45 s at 5 mph to 10-15 s at 15 mph." loading="lazy" />
  <figcaption>Left: the convoy going straight through or turning left. It has cleared the intersection only when the follow truck (FT) has. Right: time needed to go straight through, by ATMA speed and distance between the trucks. From the paper.</figcaption>
</figure>

These numbers come from field data on one vendor's system (Kratos-MSI) and a standard car-following model. Trucks from another maker may brake and hold distance differently, so an agency would recalibrate with its own trucks.

## What can this be used for?

- **Training ATMA operators**: give lead-truck drivers concrete numbers for the decisions they make on the road: how close to follow, how big a gap to wait for, and when a green light is too short to start through.
- **Setting up the system**: choose the distance between the trucks for each road from its speed limit, so it never falls below the roll-ahead distance, while keeping it short enough for lane changes and intersections.
- **Building operator aids**: the trucks already carry radar, LiDAR and cameras, so the measured gaps could be shown in the lead truck's cab against these thresholds; with vehicle-to-infrastructure communication, signals could tell the operator how much green time is left.
- **Planning work-zone traffic control**: identify where lane changes or turns will need cones or flaggers. Related studies cover how much traffic an ATMA can work in on [multilane](/tang-atma-odd-multilane-trr-2022/) and [two-lane](/tang-atma-odd-two-lane-jits-2024/) highways, and [which route](/tang-atma-route-optimization-ai-2026/) it should take through a network.
