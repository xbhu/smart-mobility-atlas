---
tldr: >-
  We showed how a roadside LiDAR sensor can share what it sees with connected and automated
  vehicles even though its data arrive late, by predicting where each object has moved during the
  delay. In simulation this cut tracking error by 82.8% for a car with no sensors of its own and
  let a sensor-equipped car follow an oncoming vehicle 35 seconds longer.
hero:
  image: /media/chen-infrastructure-cooperative-perception-jits-2024/cooperative-perception-scenario.png
  alt: Diagram of a road segment with a crosswalk, an on-ramp and five numbered cars of three kinds (higher-level automated, lower-level connected, traditional), plus a roadside infrastructure sensor next to the ramp
  caption: >-
    A roadside sensor watches every car, cyclist and pedestrian near it and shares their positions
    and speeds with connected vehicles. If car 1 is the ego vehicle, the sensor tells it about cars
    2 to 5 and the people on the crosswalk, including those its own sensors cannot see.
  credit: Chen et al. (2024)
affiliations:
  - The Pennsylvania State University
  - Leidos Inc.
author_affiliations: [[1], [1], [1], [2]]
abstract: |-
  Infrastructure-based sensors provide a potentially promising solution to support the wide adoption of connected and automated vehicles (CAVs) technologies at an early stage. For connected vehicles with lower level of automation that do not have perception sensors, infrastructure sensors will significantly boost its capability to understand the driving context. Even if a full suite of sensors is available on a vehicle with higher level of automation, infrastructure sensors can support overcome the issues of occlusion and limited sensor range. To this end, a cooperative perception modeling framework is proposed in this manuscript. In particular, the modeling focus is placed on a key technical challenge, time delay in the cooperative perception process, which is of vital importance to the synchronization, perception, and localization modules. A constant turn-rate velocity (CTRV) model is firstly developed to estimate the future motion states of a vehicle. A delay compensation and fusion module is presented next, to compensate for the time delay due to the computing time and communication latency. Last but not the least, as the behavior of moving objects (i.e., vehicles, cyclists, and pedestrians) is nonlinear in both position and speed aspects, an unscented Kalman filter (UKF) algorithm is developed to improve object tracking accuracy considering communication time delay between the ego vehicle and infrastructure-based LiDAR sensors. Simulation experiments are performed to test the feasibility and evaluate the performance of the proposed algorithm, which shows satisfactory results.
key_numbers:
  - { value: "82.8%", label: "lower tracking error for a car without sensors once the 100 ms delay is compensated (1.28 m to 0.22 m)" }
  - { value: "55.6%", label: "lower tracking error than the car's own sensors alone (0.45 m to 0.2 m)" }
  - { value: "71.4%", label: "lower error when the fused data are delay-compensated than when they are not (0.7 m to 0.2 m)" }
  - { value: "+35 s", label: "longer tracking of the oncoming car, 77.8% more than with onboard sensors alone" }
updated: 2026-10-27
---

## What problem does this research solve?

Automated vehicles see the world through LiDAR, cameras and radar. These sensors are expensive, and that cost is one of the main barriers to putting automation on the road at scale. Most cars sold today have some connectivity and basic driver assistance, but no sensors that can track the pedestrians and vehicles around them. Even a fully equipped automated vehicle cannot see around a truck, a building corner or a crest, and its sensors only reach so far.

A sensor mounted on the roadside, for example a LiDAR on a pole at an intersection, can help both kinds of vehicles. It sits high, sees the whole intersection and can share the position and speed of every car, cyclist and pedestrian with the connected vehicles nearby (top of the page). For a car without sensors this is the only view it gets; for an automated car it fills in the blind spots.

The catch is **time delay**. The roadside computer needs time to process the point cloud, and the message then has to travel over the wireless link (DSRC or cellular V2X) to the car. Studies cited in the paper report that a popular self-driving software stack takes 200 to 550 milliseconds to detect a traffic light, and that 65% of delays measured in a 4G LTE field test fell between 54 and 81 ms. By the time the message arrives, everything in it is out of date. At 70 mph, a delay of 100 to 250 ms puts an object 10 to 25 feet away from where the message says it is. Earlier work on cooperative driving had studied delay mostly for platoons and for straight-line (longitudinal) motion; how to correct for it when fusing roadside sensor data, for objects that also turn, had not been studied.

## What did we do?

We built a real-time tracking model that takes the late, roadside-detected positions of moving objects and turns them into an up-to-date estimate for the receiving vehicle, which we call the ego vehicle. The same model works for two kinds of ego vehicles:

- a **lower-level connected vehicle without perception sensors**, which relies only on what the roadside sensor tells it; and
- a **higher-level automated vehicle with its own sensors**, which merges (fuses) the roadside data with its own detections.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/tracking-framework.png" alt="Flowchart: detected motion from the ego vehicle's sensors and the infrastructure sensor feeds a motion model, delay compensation and fusion, then a UKF that outputs a predicted trajectory; a second branch for an ego vehicle without sensors skips the fusion" loading="lazy" />
  <figcaption>The tracking model. Left: a vehicle with its own sensors combines its detections with the roadside data after correcting the roadside data for delay. Right: a vehicle without sensors uses the corrected roadside data alone. Both end with an unscented Kalman filter (UKF) that outputs the predicted trajectory. From the paper.</figcaption>
</figure>

We tested the model in a co-simulation of **CARLA**, an open-source driving simulator, and **Autoware**, an open-source automated driving software stack, linked through ROS. The scene is a four-lane road with a signalized intersection. A high-performance LiDAR on the roadside watches the intersection. The ego vehicle wants to turn left while another car approaches from the opposite direction on a green light, so the ego vehicle has to detect it and yield. The simulator records the true path of every vehicle, so we can measure exactly how far each estimate is from reality. The total delay, processing plus communication, was set to 100 ms.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/carla-intersection-scenario.jpg" alt="Bird's-eye view of a simulated city intersection; a blue ego vehicle with a left-turn arrow, a black object vehicle approaching from the right, and a small box marking the roadside sensor" loading="lazy" />
  <figcaption>The simulated test. The ego vehicle (left) plans a left turn; the object vehicle (right) comes the other way. The box marks the roadside LiDAR. From the paper, CARLA simulation.</figcaption>
</figure>

## What is the key methodological contribution?

The method has three parts that work together.

1. **A motion model that allows turning.** Simple trackers assume an object keeps going straight. We use a constant turn-rate and velocity (CTRV) model: over a short time step, each object keeps its speed and its rate of turning, so it moves along an arc. This is closer to how cars actually move through an intersection.
2. **Delay compensation.** When a roadside detection arrives, it is stamped with the time it was taken. The motion model then rolls each object forward by the length of the delay, so the car works with where the object is *now*, not where it was. If the car has its own sensors, its detections and the corrected roadside detections are then put together in time order.
3. **An unscented Kalman filter (UKF).** Because turning motion is nonlinear, a standard Kalman filter does not fit, and the extended Kalman filter can make large errors when it linearizes. The UKF instead pushes a small set of carefully chosen sample points (sigma points) through the motion model and blends the prediction with each new measurement, step by step, to produce a smooth real-time trajectory.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/ctrv-motion-model.png" alt="Sketch of a car moving along a curved path from one position to the next, with its heading angle, speed and turning radius labeled" loading="lazy" />
  <figcaption>The constant turn-rate and velocity model. Over each short step the vehicle keeps its speed v and turn rate ω, so it travels along an arc of radius v/ω and its heading changes by ωΔt. From the paper.</figcaption>
</figure>

The model is not tied to LiDAR: the same delay compensation and fusion can be used with roadside cameras or radar.

## What are the key findings?

**A car without sensors can rely on the roadside sensor, if the delay is corrected.** Using the roadside data as received, the estimated position of the oncoming car was off by 1.05 to 1.62 m, 1.28 m on average, which is enough to matter for safety. With delay compensation the error fell to 0.13 to 0.33 m, 0.22 m on average: **82.8% lower**.

<figure class="figure-row">
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/scenario1-trajectory.png" alt="Line chart of position versus time from 35 to 39 seconds; the delay-compensated estimate lies almost on the ground truth line, while the uncompensated estimate runs visibly ahead" loading="lazy" />
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/scenario1-error.png" alt="Line chart of tracking error over 75 seconds; the uncompensated error stays around 1.25 m while the compensated error stays around 0.2 m" loading="lazy" />
  <figcaption>Ego vehicle without sensors. Left: a 4-second close-up of the oncoming car's position; the delay-compensated estimate (orange) nearly overlaps the truth (blue), while the uncompensated one (green) is off by more than 1 m. Right: the error over the whole run. From the paper.</figcaption>
</figure>

**A car with sensors sees better and longer with the roadside sensor.** Using only its own sensors, the ego vehicle's error ranged from 0.18 to 0.65 m, 0.45 m on average. Fusing in the delay-compensated roadside data brought it down to 0.11 to 0.32 m, 0.2 m on average, an improvement of **55.6%**. Just as important, the ego vehicle's own sensors could only see the oncoming car between 20 s and 65 s of the run. With the roadside data it was tracked for the whole 0 to 80 s, **35 seconds (77.8%) longer**.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/scenario2-perception-range.png" alt="Line chart of tracking error over 75 seconds; the fused estimate is available the whole time near 0.2 m, while the onboard-only estimate starts at about 22 s, ends at about 65 s, and stays higher" loading="lazy" />
  <figcaption>Ego vehicle with its own sensors. The fused estimate (blue) is available from the start and stays near 0.2 m; the car's own sensors (orange) pick up the oncoming car only partway through and are less accurate. From the paper.</figcaption>
</figure>

**Fusing late data without correcting it gives away much of the benefit.** When the roadside data were fused without delay compensation, the error was 0.47 to 0.98 m, 0.7 m on average, which is worse than the car's own sensors alone. Compensating the delay brought it to 0.2 m, **71.4% lower**.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/scenario2-delay-compensation.png" alt="Line chart of tracking error over 75 seconds; fusion without delay compensation fluctuates between 0.5 and 1 m, fusion with compensation stays near 0.2 m" loading="lazy" />
  <figcaption>The same fused data with (blue) and without (orange) delay compensation. From the paper.</figcaption>
</figure>

**The longer the delay, the more compensation matters.** In a sensitivity analysis (10 repeated runs per setting) we varied the delay from 50 to 200 ms. Without compensation, the average error of the fused estimate grew from 0.48 m to 1.85 m. With compensation it hardly changed and averaged 0.24 m, compared with 0.42 m for the car's own sensors. Further runs showed that as the ego vehicle or the oncoming car drives faster, the onboard-only error grows quickly, while the cooperative estimate barely changes, which suggests the approach is most valuable at freeway speeds.

<figure>
  <img src="/media/chen-infrastructure-cooperative-perception-jits-2024/sensitivity-latency.png" alt="Chart of average error versus delay from 50 to 200 ms; fusion without delay compensation rises steeply from about 0.5 m to about 1.9 m, while onboard-only stays near 0.42 m and fusion with compensation stays near 0.24 m" loading="lazy" />
  <figcaption>Average error as the delay grows from 50 to 200 ms. Only the uncompensated fusion (green) gets worse; the compensated fusion (orange) stays the most accurate. From the paper.</figcaption>
</figure>

These results come from simulation. The next step the paper names is to run the method on real vehicles in field tests, with lane changes and turns, and with real vehicle dynamics instead of the simplified ones in the simulator.

## What can this be used for?

- **Agencies planning roadside sensors and V2X at intersections**: the results show that roadside perception can serve today's connected vehicles that have no sensors, not only future automated ones, which strengthens the case for early investment at complex urban or blind rural intersections.
- **Specifying roadside units and communication links**: delay is not a minor detail. Without compensation, a 200 ms delay made the shared data less accurate than a car's own sensors; with compensation, accuracy held steady. Deployments should timestamp detections and correct for delay on the receiving end.
- **Developers of cooperative driving systems**: the motion model, delay compensation and UKF tracking can be used with any roadside sensor that reports object positions, including cameras and radar.
