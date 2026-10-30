---
tldr: >-
  We calibrate a city traffic simulation in two steps, first how many trips each origin sends to each
  destination and then when those trips leave, and the second step reads hidden queues from ordinary
  speed and density data, so the simulated rush hour slows down at the right time and not just with
  the right number of cars.
hero:
  image: /media/hu-od-calibration-tits-2017/two-stage-overview.png
  alt: >-
    Three boxes joined by yellow arrows. Stage 1, How many trips?, adjusts trips between origins and
    destinations until each link's total matches the counts, using total traffic counts. Stage 2, When
    do they leave?, shifts departure times until speed over time matches the field, using speed and
    density. Result: O-D demand by departure time, trips per origin-destination pair per 15-minute
    departure slice
  caption: >-
    The method in one line: Stage 1 gets the number of trips right; Stage 2, starting from Stage 1's
    totals, gets their timing right.
  credit: Smart Mobility Lab, after the paper's Figure 1
affiliations:
  - Metropia Inc.
  - University of Arizona
  - Shell Wind Energy
  - Maricopa Association of Governments
author_affiliations: [[1], [2], [3], [4]]
abstract: |-
  This paper presents a two-stage model to calibrate the time-dependent, dynamic Origin-Destination (O-D) demand under congested traffic conditions. The first-stage model estimates O-D trip rates by minimizing link demand deviation with a one-norm formulation approach, so that over the calibration time period, the traffic demand on calibration links matches with the link demand from the field data. Due to its linear model structure, first-stage model is more computationally effective and solvable on large real-life networks compared with the commonly seen least-square formulation. Then, a time-dependent user equilibrium traffic assignment (TDUETA) model is formulated at the second-stage to adjust the departure time profile iteratively, aiming to match the calibrated result with the field observed dynamic traffic condition, i.e. time dependent speed profile. The second-stage model starts from the concept of demand-capacity-volume relationship at a congested road segment where demand exceeds supply, utilizes shockwave theory to capture the differences between true demand and volume output, together with the idea of using travel time propagation between origin and bottleneck locations to infer real demand at origin location. The two-stage model was implemented and tested in a case study in Tucson, AZ as an experimental proof of concept, which demonstrated the effectiveness of the proposed calibration framework and method under circumstances in which departure time profile was systematically distorted and initial demand solutions deviated from the true O-D matrices.
key_numbers:
  - { value: "830", label: "links in the Tucson test network, with 80 zones and 395 nodes" }
  - { value: "16", label: "links whose total demand Stage 1 matched, converging in 9 iterations" }
  - { value: "4 h", label: "of traffic calibrated in 15-minute slices" }
  - { value: "96", label: "iterations for Stage 2 to converge; most of the error is gone in the first few" }
updated: 2026-10-27
---

## What problem does this research solve?

Transportation agencies use **dynamic traffic assignment (DTA)** models to see how traffic on a whole network responds to a change before making it on real roads. A DTA model simulates every trip minute by minute, so its output is only as good as its input: the **origin-destination (O-D) demand**, a table saying how many vehicles travel from each zone to each other zone, and when they leave. Nobody can observe that table directly. It has to be **calibrated**: adjusted until the simulation reproduces what sensors see on the road.

That adjustment is one of the hardest steps in building a DTA model, for two reasons.

- **Size.** Most methods minimize the *squared* difference between simulated and observed traffic (a least-squares, or "two-norm," formulation), usually nested inside a second optimization (a bi-level model). On a large regional network this becomes slow and sometimes impractical.
- **Counts can mislead.** Most methods use traffic counts as the target. But a count alone cannot tell light traffic from a traffic jam: as the traffic flow fundamental diagram shows, a road carries a low volume both when few cars are on it and when it is so jammed that few cars get through.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/same-count-two-states.png" alt="Schematic hump-shaped curve of flow against density, peaking at capacity. A dashed yellow line labeled same count crosses the curve twice: on the rising side at a green dot, light traffic, few cars moving fast; on the falling side at an orange dot, heavy congestion, many cars crawling" loading="lazy" />
  <figcaption>Why counts alone can mislead. The same hourly count fits two very different traffic states, so a model tuned only to counts can land on the wrong one. Schematic of the traffic flow fundamental diagram, not data.</figcaption>
</figure>

<blockquote class="pull-quote">
  <p><strong>So a model can match every count and still put the rush hour at the wrong time.</strong> Under congestion the count at a bottleneck is capped at the road's capacity, and the vehicles that could not get through are waiting in a queue the count never sees. <strong>That hidden part is the real demand, and it is what the calibration needs.</strong></p>
</blockquote>

## What did we do?

We split the problem into **two stages that run one after the other** (a sequential decomposition), instead of one large nested optimization.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/two-stage-framework.png" alt="Diagram in three columns: calibration target, calibration workflow and calibration output. Top row: field counts, total traffic on each calibration link over the whole period, feed Stage 1, How many trips?, which adjusts trips between each origin and destination until link totals match the counts with a linear one-norm program, and outputs trips per O-D pair for each mode, car and truck. An arrow labeled totals passed on leads down to the bottom row: field speeds over time on the congested links feed Stage 2, When do they leave?, which keeps the totals, reads the hidden queue from speed and density, traces it back to each origin and shifts departure times, and outputs trips per O-D pair per 15-minute departure interval" loading="lazy" />
  <figcaption>The two-stage framework: what each stage is calibrated against, what it does, and what it produces. Diagram based on the paper's Figure 1.</figcaption>
</figure>

**Stage 1: how many trips?** Adjust the number of trips for each O-D pair, separately for cars and trucks, until the total demand on each calibration link matches the field data over the whole calibration period. Using a long period matters: once the peak is over, the queue empties, so every vehicle that wanted to pass the bottleneck eventually does, and the total equals the true demand.

**Stage 2: when do they leave?** Keep Stage 1's totals and adjust only the **departure-time profile**, the number of trips leaving in each time slice, until the simulated **speed over time** on the congested links matches the field data. After each adjustment the DTA model is run again to a dynamic user equilibrium, and the loop repeats until the speed profile is close enough.

The stages are sequential, not nested: Stage 2 assumes the totals are already about right, so any remaining mismatch in congestion comes from the timing of trips. That also lets an agency adopt the method in phases, starting with Stage 1 if data, time or budget are limited.

## What is the key methodological contribution?

**A linear first stage.** Stage 1 minimizes the sum of *absolute* differences between estimated and observed link demand (a one-norm formulation) rather than the sum of squares. With a few slack variables this becomes a **linear program**, which standard LP solvers handle quickly even on large networks. Instead of weighting errors in the objective, the model puts the limits in the constraints: each O-D pair, and the total number of trips, may move only within a tolerance that the analyst sets.

**Reading the hidden demand from speed and density.** Stage 2 uses ordinary bottleneck data, volume and density (or speed), to rebuild the demand that the counts miss. It works with **cumulative vehicle curves**: for each location, the total number of vehicles that have passed it by each moment.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/cumulative-curves.png" alt="Schematic of cumulative vehicles against time with four curves. An orange curve, vehicles passing the bottleneck, counted by the sensor, rises at a capped straight slope during the peak. A blue curve, arrivals at the back of the queue, rises faster above it; a vertical arrow between them is labeled vehicles in queue equals density times queue length times lanes, and a horizontal arrow is labeled time in queue. A green curve further left, departures from origins, what Stage 2 solves for, is linked to the blue curve by a horizontal arrow labeled travel time to the queue. A grey dashed curve, the initial model's departures, rises earlier than the green curve, with a downward arrow labeled correction" loading="lazy" />
  <figcaption>How Stage 2 works backward from the sensor. The orange curve is what the bottleneck counts. Adding the vehicles in the queue gives the blue curve, the true arrivals. Shifting it back by the travel time from the origins gives the green curve, the departures the model should have. The gap to the initial model (dashed) is the correction. The curves are illustrative, not data. Schematic based on the paper's Figure 2.</figcaption>
</figure>

The procedure, step by step:

1. **At the bottleneck**, the cumulative count from the sensor is the volume that got through.
2. **At the back of the queue**, add the vehicles waiting in it: density in the queue × queue length × number of lanes. The queue length comes from **shockwave theory**, which tracks how fast the back of a queue moves upstream from the volume and density on either side of it.
3. **At the origins**, shift that curve earlier by the time-dependent travel time from each origin to the back of the queue. This gives the departure curve that would produce the observed congestion.
4. **Correct the departures** in the DTA model by a step toward that curve, rerun the model to equilibrium, and check the speed profile. Repeat until it matches, then turn the curve into time-dependent O-D tables.

In short, the field data are used not only as the target to hit but **inside the calibration**, to infer the real demand at the bottleneck and carry it back to where the trips begin.

## What are the key findings?

We tested the method on a **Tucson, Arizona** network in the DTA model **DynusT**: **80 traffic analysis zones, 830 links and 395 nodes**. Stage 1 calibrated **16 links**; Stage 2 targeted **one freeway link and one arterial link**, over **4 hours** in **15-minute** intervals. To make the test hard, the starting demand was deliberately wrong compared with the ground-truth (GT) scenario: its departure times were pushed earlier, so congestion at the bottlenecks appeared too soon, and its total trips were off as well.

**Stage 1 gets the totals right.** It converged in **9 iterations**. Before calibration, the starting model carried too little traffic on every calibration link; after Stage 1 the links sit almost on the 45-degree line against the sensor totals.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/first-stage-link-demand.png" alt="Scatter plot of link traffic count in the model against sensor traffic count, ground truth, from 0 to 25,000, with a 45-degree line. Black squares, the uncalibrated scenario, fall below the line, by up to about 3,000 vehicles on the busiest links. Blue triangles, the first-stage result, sit on the line" loading="lazy" />
  <figcaption>Stage 1 on the 16 calibration links. Black squares: the starting model, below the line on every link. Triangles: after Stage 1, on the line. Image: from the paper.</figcaption>
</figure>

**Right totals, wrong rush hour.** Matching the totals is where most earlier studies that calibrate to counts alone would stop. Yet the speed profiles show the congestion still came at the wrong time. On the freeway link, the Stage 1 slowdown still started well ahead of the real one. On the arterial link, the model jammed within the first hour, when real traffic there was still light.

**Stage 2 fixes the timing.** After Stage 2 the speed profiles follow the ground truth on both links. This needed no data beyond the volume and density at the bottleneck that agencies commonly have.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/speed-profiles.png" alt="Two line charts of speed in miles per hour over 240 minutes. Top, freeway link: the ground truth, a thick black line, drops from about 20 to under 10 mph around minute 125 and recovers near minute 190. The uncalibrated case, orange dashes, never shows that deep slowdown; the Stage 1 line, dotted, drops earlier, around minute 95, and recovers early; the Stage 2 line, thin black, follows the ground truth drop and recovery. Bottom, arterial link: the ground truth stays near 30 mph until about minute 66, then drops; the uncalibrated and first-stage lines drop within the first 10 minutes; the second-stage line, purple, stays high until about minute 66 like the ground truth" loading="lazy" />
  <figcaption>Speed over 4 hours on the freeway link (top) and the arterial link (bottom). Compare each line's drop with the ground truth (thick black). After Stage 1 the slowdown still comes too early; after Stage 2 (thin black on top, purple at bottom) it lines up. Image: from the paper.</figcaption>
</figure>

**The departures move to the right time.** The cumulative departure curves show why. Stage 1's curve (blue) still runs well off the ground truth (black) on the freeway link; Stage 2's curve (purple) comes closer, even though the starting point was far from the truth. The volume profiles on both links tell the same story.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/departure-curves.png" alt="Two line charts of cumulative departing vehicles over 225 minutes, for the freeway link (top, up to about 27,000) and the arterial link (bottom, up to about 7,000). The uncalibrated curve, red dots, rises too early; the first-stage curve, light blue, sits between; the second-stage curve, purple, lies close to the ground truth, black" loading="lazy" />
  <figcaption>Cumulative vehicle departures on the freeway link (top) and the arterial link (bottom). The starting model (red dots) sends trips too early; after Stage 2 (purple) the curve is close to the ground truth (black). Image: from the paper.</figcaption>
</figure>

**It converges fast.** Stage 2 converged at iteration **96**, but the mean absolute error (MAE) of speed on both links falls sharply in the first few iterations and then stays flat.

<figure>
  <img src="/media/hu-od-calibration-tits-2017/mae-convergence.png" alt="Line chart of mean absolute error of speed, in mph, over about 100 calibration iterations, for the freeway link, the arterial link and their average. All three drop steeply in the first two or three iterations, from about 18 mph on the freeway link, and then level off at about 4 to 6 mph" loading="lazy" />
  <figcaption>Speed error over the Stage 2 iterations. Almost all the improvement happens in the first few. Image: from the paper.</figcaption>
</figure>

## What can this be used for?

- **Calibrating regional DTA models.** The linear first stage keeps calibration practical on large real networks, where least-squares, bi-level methods struggle.
- **Getting the peak right, not just the volume.** Using speed and density at bottlenecks makes the model reproduce *when* congestion starts and ends at a bottleneck, not only how much traffic passes it.
- **No new data.** The method uses volume, speed and density from existing detectors.
- **Phased adoption and real-time use.** An agency can run Stage 1 first and add Stage 2 later. Because the method takes link speed, density and volume as input and the first stage is fast, it could also be fed by real-time data and run online.

The test calibrated Stage 2 on one freeway and one arterial link. With more calibration links, the links interact, and modeling those interactions is the next step.
