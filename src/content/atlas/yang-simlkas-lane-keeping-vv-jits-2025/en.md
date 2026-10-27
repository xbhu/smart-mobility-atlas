---
tldr: >-
  We built SimLKAS, an open-source simulator setup in CARLA that tests a camera-based lane keeping
  system in rain, fog and darkness that are hard to stage on real roads, and found that heavy rain,
  high speed and curves push the car furthest from the lane center by day, while streetlights and
  headlights decide performance at night.
hero:
  image: /media/yang-simlkas-lane-keeping-vv-jits-2025/test-conditions-grid.jpg
  alt: Nine views of the same simulated sedan on a multi-lane road, from clear daylight through rain and fog to night scenes lit only by streetlights or headlights
  caption: "The same simulated car in nine of the test conditions. Top row: clear, moderate rain, heavy rain. Middle: moderate fog, heavy fog, night with streetlights and low beams. Bottom: night with streetlights and high beams, then no streetlights with low beams and with high beams."
  credit: Yang et al. (2025)
affiliations:
  - The Pennsylvania State University
  - Stony Brook University
author_affiliations: [[1], [1], [2], [1], [2], [2], [1]]
abstract: |-
  Lane Keeping Assistance Systems (LKAS) significantly enhance vehicle safety by maintaining lane centering through automated steering control. Evaluating LKAS performance in real-world conditions is challenging, as rare and extreme scenarios are difficult to capture systematically. Moreover, real-world testing is often time-consuming, costly, and lacks precise control over critical environmental factors, limiting its effectiveness for comprehensive assessment. However, existing simulation-based evaluations, such as those in CARLA, assume perfect pavement marking detection and neglect lateral deviations, limiting real-world applicability. To address these challenges, this study introduces SimLKAS, a simulation-based framework implemented in CARLA for systematic verification and validation of LKAS under diverse and challenging environments. The framework comprises three modules: context-based pavement marking perception, feedback-based loop controller, and ensemble learning-based performance evaluation. A key advantage of this modular framework is its analytical traceability for assessing the propagation of data inaccuracies and modeling errors across layers, along with its algorithmic flexibility for integrating alternative algorithms at each stage. Extensive experiments confirm that SimLKAS generates diverse testing conditions while reproducing realistic lane-keeping patterns consistent with previous studies, validating its effectiveness for LKAS assessment. The results, analyzed using Random Forest regression and SHAP analysis, indicate that heavy rain, high speed, and curved roads significantly contribute to increased lateral deviation in daytime conditions, whereas nighttime performance is strongly influenced by streetlights and vehicle headlight settings. This framework provides researchers and practitioners with a scalable, repeatable, and controlled platform for benchmarking LKAS algorithms, optimizing performance, and enhancing safety validation, thereby supporting advancements in autonomous driving technology.
key_numbers:
  - { value: "86.3%", label: "of new U.S. vehicles had lane keeping assistance in 2023, up from 1.4% in 2015" }
  - { value: "36 × 3", label: "scenarios per map, each run three times: 108 runs on an urban map and 108 on a highway map" }
  - { value: "52.4%", label: "of the daytime model's feature importance comes from heavy rain, the largest single factor" }
  - { value: "< 20%", label: "of the highway route completed in some heavy-rain runs" }
updated: 2026-10-27
---

## What problem does this research solve?

**Lane Keeping Assistance Systems (LKAS)**, often marketed as lane centering, use a forward camera to find the lane markings and steer the car to stay in the middle of its lane. They have spread very quickly: the share of new U.S. vehicles with LKAS grew from **1.4% in 2015 to 86.3% in 2023**. A 2018 study estimated that up to 27% of head-on and single-vehicle crashes in Finland could be prevented if LKAS were widely deployed.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/lkas-adoption.png" alt="Bar chart of the share of new U.S. vehicles with lane keeping assistance, rising every year from 1.4% in 2015 to 86.3% in 2023" loading="lazy" />
  <figcaption>Share of new U.S. vehicles equipped with lane keeping assistance, 2015–2023. In eight years it went from almost none to almost all. Data: MITRE (2024), PARTS market penetration of ADAS.</figcaption>
</figure>

But how well do these systems work when conditions are bad? Industry standards such as **ISO 11270** test LKAS on straight or curved roads at 20–22 m/s with clear markings on closed tracks, and require the car to stay within 0.4 m of the lane center (1.1 m for heavy vehicles). NHTSA's test procedure likewise calls for ideal weather and high-quality markings. These are minimum requirements, not a picture of how the system behaves in **heavy rain, fog, or on a dark curve**. Vendors' manuals warn that LKAS may not work reliably in poor weather, yet drivers can still overestimate it.

Testing those conditions on real roads is slow, costly and sometimes unsafe, and you cannot order up a specific combination of rain, darkness, speed and curvature when you need it. Most field studies also record only a yes/no outcome (did the system see the left line, the right line, both?) rather than how far the car actually drifted. Simulators could fill the gap, but standard simulators such as CARLA and SUMO assume the car sees the lane perfectly and drives almost exactly on the centerline, which real vehicles do not.

## What did we do?

We built **SimLKAS**, a simulation framework in the open-source **CARLA** driving simulator in which a working LKAS has to find the lane markings in the camera image itself and steer from what it sees. If rain or darkness makes the markings hard to see, the car drifts, just as a real system would. The framework has three modules:

1. **Perception**: finds the lane markings in each camera frame.
2. **Control**: turns the detected lane into steering, throttle and brake commands, 60 times a second.
3. **Evaluation**: records how far the car strays from the lane center and uses machine learning to work out which conditions caused it.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/simlkas-framework.png" alt="Flow diagram: inputs such as weather, road geometry, speed, streetlights, vehicle lights and time of day feed a CARLA simulation, which passes camera data to a lane perception module, then a feedback loop controller, then an ensemble-learning evaluation module, with applications listed on the right" loading="lazy" />
  <figcaption>The SimLKAS framework. Test conditions on the left drive the CARLA simulation; perception, control and evaluation modules sit around it, and each can be swapped for a different algorithm. Image: Yang et al. (2025).</figcaption>
</figure>

The perception module uses classic, explainable image processing rather than a black-box neural network: it converts each frame to grayscale, finds edges, warps the view into a bird's-eye view so lane lines appear parallel, groups the edge pixels into individual markings with a clustering method (DBSCAN) that ignores stray noise, and fits a straight line to each marking.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/lane-detection-pipeline.png" alt="Five panels showing one camera frame on a foggy road, the same frame in grayscale, its detected edges, the edges in a top-down bird's-eye view, and the final detected left and right lane lines in red and green" loading="lazy" />
  <figcaption>How the system finds the lane in one foggy frame: original image, grayscale, edges, bird's-eye view, and the detected left (red) and right (green) lane lines. Image: Yang et al. (2025).</figcaption>
</figure>

The control module uses **PID feedback control**, the simple and robust approach widely used in industry. It steers to correct both how far the car is from the lane center and how its heading differs from the lane direction, limits how fast the steering can change, and falls back on the last good command if the lane disappears for a moment.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/carla-lkas-drive.jpg" alt="A blue sedan driving itself on a gray multi-lane highway in the CARLA simulator, with a readout of speed, throttle, steering and brake in the top-left corner" loading="lazy" />
  <figcaption>The test vehicle in CARLA's highway map with the on-screen readout of speed, throttle, steering and brake. Image: Yang et al. (2025).</figcaption>
</figure>

We then tested it on two CARLA maps: **Town03**, an urban road (350 m route, 30–60 km/h), and **Town04**, a highway (1 km route, 30–90 km/h). Each route has straight and curved sections. We varied **weather** (clear, moderate rain, heavy rain, moderate fog, heavy fog), **time of day**, **streetlights** (on or off) and **headlights** (low or high beam), for **36 scenarios per map, each run three times**: 108 runs per map.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/test-routes.jpg" alt="Two aerial views of simulated towns with the test route drawn in red: on the left a dense urban grid with an L-shaped route, on the right a highway loop through green hills and water with a curved route" loading="lazy" />
  <figcaption>The two test routes (red). Left: Town03, urban streets. Right: Town04, highway. Image: Yang et al. (2025).</figcaption>
</figure>

## What is the key methodological contribution?

SimLKAS is **modular and traceable**. Every module is defined explicitly, so a researcher can follow an error from where it starts (a missed lane marking in heavy rain) through the controller to the final drift on the road. Any module can be replaced, for example a deep-learning lane detector in place of the edge-based one, or a different controller, and compared under exactly the same conditions. The code is open source, so others can rerun the scenarios or add their own.

For evaluation, we used a **Random Forest** model to predict the largest lateral deviation in each run from the test conditions, and **SHAP**, a game-theory method that shows how much each condition pushed a given result up or down. Ordinary regression could not capture how the conditions interact (rain matters more at speed and on curves, for instance); this combination can, and it still explains its answers.

## What are the key findings?

**The simulated system drifts like a real automated vehicle, not like a perfect robot.** In clear weather it stayed close to the lane center, best at low and moderate speeds, with deviation growing at higher speeds. Its deviations are in line with what earlier studies found for real automated vehicles (generally within about ±0.1 m). Human drivers in the NGSIM trajectory data from US-101 and I-80 wander much more, up to about ±1.5 m.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/lateral-deviation-lkas-vs-human.png" alt="Four histograms of lateral deviation. Top: simulated lane keeping on the urban map Town03 and highway map Town04, with values between about minus 0.2 and plus 0.1 meters, colored by speed. Bottom: human drivers on US-101 and I-80, bell-shaped and spread from about minus 1.5 to plus 1.5 meters" loading="lazy" />
  <figcaption>How far the car strays from the lane center in clear weather. Top: SimLKAS on the urban (Town03) and highway (Town04) maps, one color per speed. Bottom: human drivers on US-101 and I-80. Note the axes: the simulated system stays within about 0.2 m, while human drivers spread over ±1.5 m. Most simulated deviations are to the left because the test routes only turn left. Image: Yang et al. (2025).</figcaption>
</figure>

**Bad weather, speed and curves add up.**

- **Heavy rain is the worst condition.** It degrades lane-keeping on both straight and curved roads, most of all at high speed. On the highway map, some heavy-rain runs completed **less than 20% of the route** because of the severe weather, leaving few data points on curves.
- **Fog hurts less than rain.** Moderate fog behaves much like clear weather; heavy fog increases variability on curves, but every fog run was completed. Fog mostly hides the road far ahead, while lane keeping depends on the markings close to the car; rain and standing water obscure markings at every distance.
- **At night, light matters.** Without streetlights, deviation grows, especially at speed and on curves. Low beams are enough on straight roads but not on curves; with high beams the system performs about as well as in daylight.

<figure>
  <img src="/media/yang-simlkas-lane-keeping-vv-jits-2025/feature-importance-day-night.png" alt="Two bar charts of feature importance. Daytime: heavy rain 52.4%, vehicle speed 35.3%, straight versus curved road 10.5%, moderate fog 1.7%, heavy fog 0.1%, moderate rain 0.0%. Nighttime: vehicle speed 39.9%, straight versus curved road 22.7%, streetlights 20.9%, low versus high beam 16.5%" loading="lazy" />
  <figcaption>What drives the worst drift in each run, according to the Random Forest model. By day, heavy rain and speed explain almost nine-tenths of it; at night, speed, curves, streetlights and headlights all matter. The SHAP analysis agrees on the leading factors and ranks streetlights first at night. Redrawn from the paper's Figures 13 and 15.</figcaption>
</figure>

The daytime model explains the data reasonably well (R² = 0.63); the nighttime model less so (R² = 0.31).

## What can this be used for?

- **Automakers and suppliers** can use SimLKAS as a **pre-validation step** before field testing: find the conditions where a lane keeping design breaks down, cheaply, safely and repeatably, then focus track and road tests on those.
- **Researchers** can benchmark lane detection and steering control algorithms against each other under identical conditions, and trace how a perception error turns into lateral drift.
- **Transportation agencies** get evidence on the role of road-side conditions: streetlights and curve geometry measurably affect how well these systems keep the lane at night.
- The results point to concrete improvements: weather-robust lane detection (deep learning trained on adverse weather, or camera fused with LiDAR or radar), slowing down automatically for rain and curves, adaptive headlights, and HD maps or vehicle-to-infrastructure (V2I) data as a backup when markings disappear.

SimLKAS does not replace real-world testing. CARLA does not model snow, debris, worn markings, sensor drift, actuator delays or the driver in the loop, so the simulated system may look more stable than a real one. Its value is in narrowing down where real testing should look.
