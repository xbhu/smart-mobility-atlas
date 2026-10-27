---
tldr: >-
  A driverless work-zone truck (ATMA) crawls along at 5-15 mph and acts as a moving bottleneck on a
  multilane highway. We derived a simple formula for how much road capacity it takes away, checked
  it against real slow trucks on I-80, and found that on a typical four-lane highway an ATMA keeps
  traffic at level of service C as long as the road carries fewer than about 40,000 vehicles a day.
hero:
  image: /media/tang-atma-odd-multilane-trr-2022/moving-bottleneck.png
  alt: Diagram of a highway with two lanes in one direction. In the lower lane, a lead truck and a follow truck travel slowly inside a red dashed box labeled Moving bottleneck, with a gap L-gap between them; a red car behind them moves into the upper lane to pass, while other cars cruise at speed v-u.
  caption: >-
    The moving bottleneck. The ATMA's two trucks (red box) crawl along one lane, so cars that catch
    up with them (red) must squeeze into the other lane to get past. While the trucks are there, the
    road carries less traffic than usual.
  credit: Tang, Hu & Yang (2022)
affiliations:
  - The Pennsylvania State University
  - Old Dominion University
author_affiliations: [[1], [1], [2]]
abstract: |-
  The Autonomous Truck Mounted Attenuator (ATMA) vehicle system is a quickly emerging technology that leverages connected and automated vehicle (CAV) capabilities for maintenance of transportation infrastructure. Promoted by FHWA and about a dozen State DOTs, it is a niche CAV application in leader-follower style, to remove DOT workers from the following maintenance truck, in order to reduce fatalities in work zone locations. Because practicable and implementable guidance for deployment of this technology is largely missing in MUTCD, State DOTs have been making their own deployment criteria. For example, Colorado DOT is using annual average daily traffic (AADT) of less than 6,000 as the criteria to identify low-volume roads for ATMA deployment. In this manuscript, we focus on the Operational Design Domain (ODD) problem, i.e., under what traffic conditions should ATMA be deployed. To this end, modeling efforts are first focused on the derivation of an effective discharge rate that can be associated with a moving bottleneck that is caused by slow-moving ATMA vehicles on a multilane highway. Then, based on the demand input and discharge rates, microscopic traffic flow models are employed to calculate vehicle delay and density, which the Highway Capacity Manual (HCM) suggests are key indicators of a multilane highway's level of service (LOS). In this way, the linkage between AADT and LOS is analytically established. NGSIM data is used for the model validation and shows that the developed model correctly captures the effective discharge rate discount caused by moving bottlenecks. The modeling results demonstrate that roadway performance is sensitive to the K factor and D factor, as well as the operating speed of ATMA and, if LOS=C is a desirable design objective, a good AADT threshold to use would be around 40,000 vehicles per day.
key_numbers:
  - { value: "40,000", label: "vehicles per day: the AADT below which an ATMA keeps a typical four-lane highway at LOS C" }
  - { value: "6,000", label: "vehicles per day: the AADT limit Colorado DOT had been using for ATMA work" }
  - { value: "13.6%", label: "largest error of our capacity estimate for six real slow trucks on I-80, vs up to 55.2% when the slowdown is ignored" }
  - { value: "35,000", label: "vehicles per day: the threshold drops this low when more of the day's traffic falls in the peak hour (K factor 0.11)" }
updated: 2026-10-27
---

## What problem does this research solve?

Mobile maintenance work such as striping, sweeping, bridge flushing and pothole patching keeps highways safe, but it is dangerous for the crews who do it. In Missouri alone, slow-moving maintenance vehicles were involved in crashes more than 80 times between 2013 and the time of the study, injuring many DOT workers.

The **Autonomous Truck Mounted Attenuator (ATMA)** takes workers out of the most exposed seat. A human-driven lead truck does the work, and a driverless follow truck shadows it, carrying a crash cushion (the attenuator). If a driver runs into the back of the operation, the empty follow truck takes the hit. Colorado and Missouri were among the first states to use it; California, Minnesota, Virginia, Ohio, North Dakota and Tennessee were testing or deploying similar systems, and Colorado DOT leads a pooled fund on autonomous maintenance technology with 13 state DOTs and FHWA (see our [field-testing study](/av-atma-field-testing-trr-2021/)).

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/leader-follower-system.jpg" alt="A driverless follow truck carrying a yellow crash attenuator parked next to a lead work truck, with a wireless signal drawn between them, in a yard full of similar trucks" loading="lazy" />
  <figcaption>The leader-follower system: the driverless follow truck with its attenuator (left) and the human-driven lead truck (right), linked by vehicle-to-vehicle radio. Image: Royal Truck &amp; Equipment.</figcaption>
</figure>

The catch is speed. The trucks typically move at only **5-15 mph**, much slower than the traffic around them. On a multilane highway, drivers can get around them in the other lanes, but they have to merge to do it, and the road carries fewer vehicles per hour while the ATMA is there. At heavy traffic, queues and delays build up behind it.

So agencies have to decide **under how much traffic an ATMA can be used**: in automated-vehicle language, the system's *operational design domain* (ODD). The Manual on Uniform Traffic Control Devices and other national standards say nothing about it, so states set their own rules. Colorado DOT, for example, used an annual average daily traffic (AADT) of **under 6,000 vehicles** to pick low-volume roads for ATMA work. That may suit Colorado, but in states such as California and New York most multilane highways are far busier, and nobody had a sound way to say whether 6,000 is the right number, or how to work one out.

## What did we do?

We built an analytical model that links a multilane highway's daily traffic (AADT) to the level of service drivers get while an ATMA is working, so an agency can read off the traffic level at which the disruption becomes unacceptable. It works in three steps:

1. **Capacity.** Work out how many vehicles per hour can get past the slow-moving ATMA. This is the hard part, and our main contribution (next section).
2. **Delay.** Compare that reduced capacity with the traffic arriving in the peak period. The peak demand comes from the AADT and three standard planning factors: the share of daily traffic in the peak hour (K factor), the share going in the busier direction (D factor), and the peak-hour factor (PHF). When demand exceeds capacity, a queue forms, and a classic queuing model gives the average delay per vehicle.
3. **Level of service.** Turn the delay into an average speed over the road segment, then into traffic **density** (vehicles per mile per lane). The Highway Capacity Manual (HCM) uses density to grade multilane highways from LOS A to F, with breakpoints at 11, 18, 26, 35 and 45 vehicles per mile per lane.

Because the whole chain is in closed form, it runs instantly for any road, traffic pattern or ATMA speed.

## What is the key methodological contribution?

Earlier models of capacity drops at merges and moving bottlenecks either lacked an explicit formula (one needed a system of four equations solved numerically) or did not fit the ATMA, which is two trucks running 100-1,000 ft apart rather than a single slow vehicle. We derived a **simple, closed-form formula** for the capacity left on the road while an ATMA passes.

The trick, following Newell's moving-bottleneck theory, is to **change your point of view**. Picture an observer riding along beside the ATMA at its speed. To that observer the trucks are standing still, and the two-lane road simply narrows to one lane, like a fixed lane closure. Lane closures are well understood: their capacity follows from the road's flow-density relationship (the fundamental diagram). We work out the capacity in the moving observer's frame, then convert it back to what a fixed observer at the roadside would count.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/moving-observer-diagram.png" alt="Flow-density diagram with two pairs of triangles. Black triangles O-F'-I' and O-G'-I' are the one-lane and two-lane fundamental diagrams seen from the roadside; red triangles O-F-I and O-G-I are the same diagrams seen by an observer moving with the ATMA, tilted down by the ATMA speed. Points F, H and their primed counterparts mark the traffic states downstream and upstream of the bottleneck." loading="lazy" />
  <figcaption>The same road seen two ways. Black: flow and density as counted at the roadside, for one lane (smaller triangle) and two lanes (larger). Red: the same diagrams as seen by an observer moving with the ATMA. The capacity past the ATMA is read off in the moving frame and converted back to the roadside (point H'). From the paper.</figcaption>
</figure>

The result is the road's normal capacity multiplied by a **discount factor** that depends on just three speeds: how fast traffic cruises, how fast the ATMA moves, and how fast stop-and-go waves travel backward through traffic. The formula behaves as it should at the extremes: if the ATMA stood still, the factor would be one half, the same as closing one of the two lanes; if it moved as fast as traffic, it would be one, with no loss at all.

**Checked against real trucks.** To test the formula we used NGSIM, a public dataset that tracks every vehicle on a stretch of road. We took two lanes (about 1,090 ft) of northbound I-80 in Emeryville, California, on an afternoon in April 2005, and found six slow trucks that behaved like moving bottlenecks. For each, we counted the actual number of vehicles per hour that got past a fixed point and compared it with the formula.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/ngsim-truck-trajectories.png" alt="Four panels of vehicle trajectories, time running left to right and distance upward, for lanes 5 and 6 of I-80. Top row: a slow truck (red, ID 2862) in lane 6 with flatter trajectories than the cars around it; one car behind it breaks off to change lanes. Bottom row: a very slow truck (red, ID 1522) in lane 5, behind which the trajectories form stop-and-go steps, while lane 6 next to it flows steadily." loading="lazy" />
  <figcaption>Real moving bottlenecks on I-80. Each line is one vehicle moving through the study section; the flatter the line, the slower the vehicle. Top: a truck at 11 mph (red, lane 6); the car behind it changes lanes to get by. Bottom: a truck at 5 mph (red, lane 5) leaves stop-and-go traffic behind it, while the next lane keeps flowing. From the paper (NGSIM data).</figcaption>
</figure>

With the road's measured characteristics, its normal capacity across the two lanes is 3,076 vehicles per hour. Behind the 11 mph truck, the count was about 2,740; the formula predicts 2,568, an error of **6.3%**, against 12.3% if the truck's effect is ignored. Behind the 5 mph truck, only about 1,982 vehicles per hour got through; the formula predicts 2,127, an error of **9.5%**, against 55.2%. Across all six trucks, the formula's error was at most **13.6%**, while assuming normal capacity always overestimated the flow, by 12.3-55.2%.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/discharge-validation.png" alt="Chart for six trucks (IDs 1522 to 2862). Solid lines, left axis: the normal capacity (red, flat at about 3,076 vehicles per hour), the formula's estimate (blue, about 2,130 to 2,660) and the observed flow (black, about 1,980 to 2,740). Dashed lines, right axis: the error when ignoring the truck (red, about 12% to 55%) and the formula's error (blue, about 2% to 14%)." loading="lazy" />
  <figcaption>Validation on six slow trucks. The formula's estimate (blue) tracks the observed flow past each truck (black), while the road's normal capacity (red) overestimates it every time. Dashed lines show the errors: blue for the formula, red for ignoring the truck. From the paper.</figcaption>
</figure>

## What are the key findings?

We applied the model to a typical one-mile segment of four-lane highway (two lanes each way) with traffic cruising at 50 mph, the ATMA working at **10 mph**, and the HCM's typical planning factors (K = 0.09, D = 0.6, PHF = 0.9), for daily traffic from 15,000 to 60,000 vehicles. Multilane highways often carry 15,000-40,000 vehicles a day, and some as many as 100,000.

- **The threshold is about 40,000 vehicles per day.** Up to 40,000, density rises only gently, from 9 to 24 vehicles per mile per lane, traffic keeps its free-flow speed and there is no delay. Density reaches the LOS C limit (26) between 40,000 and 45,000; above 45,000, queues form and the average delay climbs steeply, to 36 seconds per vehicle at 60,000. We took **LOS C** as the design target, because from LOS A to C speeds hardly fluctuate, and steady speeds matter for work-zone safety. That makes **40,000 vehicles per day** a good limit for ATMA work in this scenario, far above the 6,000 Colorado DOT had been using.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/aadt-delay-density.png" alt="Chart against AADT from 15,000 to 60,000 vehicles per day. Density (red, right axis) rises in a near-straight line from about 9 to 24 vehicles per mile per lane at 40,000, then bends upward through the LOS C, D, E and F bands to about 54. Average delay (black dashed, left axis) stays at zero up to 45,000, then rises to about 36 seconds per vehicle. Horizontal dashed lines mark the LOS boundaries." loading="lazy" />
  <figcaption>Finding the threshold. Density (red) stays in LOS A-C up to about 40,000 vehicles per day, then bends upward through D, E and F; delay (black dashed) is zero until 45,000 and then takes off. From the paper.</figcaption>
</figure>

- **The right threshold depends on the traffic pattern.** The more of the day's traffic squeezed into the peak hour, the lower it falls: as the K factor rises from 0.08 to 0.11, the threshold drops from 50,000 to **35,000 vehicles per day**. A more lopsided directional split has a similar effect: as the D factor rises from 0.5 to 0.65, it drops from 50,000 to 40,000, and the delay at 60,000 vehicles a day grows from 8 to 47 seconds per vehicle.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/sensitivity-k-factor.png" alt="Two charts against AADT for K factors 0.08, 0.09, 0.10 and 0.11. Left: average delay stays at zero and then rises, starting earlier and climbing higher (to about 62 seconds per vehicle) as K increases. Right: density curves with LOS bands; higher K curves cross the LOS C line at lower traffic." loading="lazy" />
  <figcaption>A peakier traffic pattern (higher K factor) makes delay start earlier and grow faster (left), and pushes density past the LOS C line at lower daily traffic (right). From the paper.</figcaption>
</figure>

- **A slower ATMA hurts more once traffic is heavy.** Slowing the ATMA from 15 to 5 mph lowers the threshold from 45,000 to 40,000 vehicles per day, but the bigger change is what happens beyond it: at 60,000 vehicles a day the average delay reaches **109 seconds per vehicle** with a 5 mph ATMA, against under 20 seconds at 15 mph. A slower ATMA is a tighter bottleneck.

<figure>
  <img src="/media/tang-atma-odd-multilane-trr-2022/sensitivity-atma-speed.png" alt="Two charts against AADT for ATMA speeds of 5, 10 and 15 mph. Left: average delay at 5 mph (red) starts rising at 40,000 and reaches about 109 seconds per vehicle at 60,000, far above 10 mph (about 36) and 15 mph (about 16). Right: density curves overlap up to 40,000, then the 5 mph curve shoots up to about 90 vehicles per mile per lane." loading="lazy" />
  <figcaption>ATMA speed matters most at heavy traffic. The three speeds give the same density up to about 40,000 vehicles per day, but beyond that a 5 mph ATMA (red) causes several times the delay of a 15 mph one (black). From the paper.</figcaption>
</figure>

The numbers above are for the typical scenario in the paper. The model is set up for two lanes in each direction, but it can be applied step by step to highways with three or more lanes, and an agency would rerun it with its own road, traffic and operating speed.

## What can this be used for?

- **State DOTs writing ATMA deployment rules**: replace a single statewide AADT cutoff with a threshold worked out from the road's own traffic pattern (K and D factors) and the planned operating speed. For busy multilane highways, the numbers suggest an ATMA can be used on far more roads than a 6,000-vehicle limit allows.
- **Maintenance planners**: check before an operation whether a highway can absorb an ATMA at the planned time, or whether to move the work off-peak or run the trucks faster where the job allows.
- **Traffic analysts**: the closed-form capacity formula works for other slow-moving vehicles too, as the test on ordinary slow trucks shows. The same approach underlies our [route-planning study](/tang-atma-route-optimization-ai-2026/) for ATMA work across a road network, and our [two-lane highway study](/tang-atma-odd-two-lane-jits-2024/) covers roads where drivers must pass in the oncoming lane.
