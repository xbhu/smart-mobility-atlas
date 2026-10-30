---
tldr: >-
  We built ATN3D, a 3D object detector that combines LiDAR and 4D radar and lets each sparse patch of
  the scene "ask its neighbors" for evidence, so an automated vehicle spots distant cars, pedestrians
  and cyclists earlier and more reliably, especially in fog, at no extra cost in speed.
hero:
  image: /media/biswas-atn3d-radar-lidar-tits-2027/clear-vs-fog-lidar.jpg
  alt: Two bird's-eye views of the same intersection as seen by a LiDAR sensor, with distance rings every 10 meters. In clear weather, points trace the streets out past 70 meters; in simulated heavy fog, most points beyond about 30 meters are gone.
  caption: The same intersection seen from above by a car's LiDAR, in clear weather (left) and in simulated heavy fog (right). Rings mark every 10 meters. Fog wipes out most of the far returns, which is exactly where an automated vehicle needs to see early. Colors show return strength, which also drops in fog.
  credit: From the paper (View-of-Delft dataset)
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  3D object detection is the backbone of perception for automated vehicles (AV) and broader intelligent transportation systems applications. Long-range detection is challenging because sensing evidence is sparse; yet this "long-range" scenario is routine in traffic. Although > 30 m is often labeled long-range in computer vision, on roadways it affords only ≈ 1−2 s for perception and decision-making. Under such extreme sparsity, two core challenges arise. First, early multimodal fusion tends to discard sparsity information and inject noise from empty or falsely occupied cells, degrading long-range recall. Second, context-agnostic uniform channel supervision favors dense and near-range samples, leaving far and small objects under-optimized, delaying the earliest detection of distant objects. We propose "Ask The Neighbor" (ATN3D), a LiDAR-Radar framework tailored for sparse-range conditions. ATN3D introduces (i) Density-aware early fusion with cross-modal gating that conditions fusion on per-voxel density/sparsity and Radar evidence, (ii) Occupancy-gated neighborhood aggregation with circular kernels to aggregate only from credible cells, (iii) Evidence-conditioned channel self-attention to adapt channel weights with weather/range, and (iv) a Range-aware loss that re-balances classification and localization by distance, aligning training with distance-stratified evaluation. On the VoD benchmark across clear and foggy conditions, ATN3D surpasses strong baselines: +3.55% mAP in clear weather and +8.41% mAP under simulated heavy fog; for > 30 m objects, gains are +3.33% (clear) and +2.09% (heavy fog). These results indicate earlier and more reliable long-range detections under sparse sensing in on-road traffic.
key_numbers:
  - { value: "10×", label: "fewer LiDAR points per object beyond 30 m than within 30 m" }
  - { value: "+8.41%", label: "detection accuracy (3D mAP) over the strongest baseline in simulated heavy fog" }
  - { value: "+3.33%", label: "average accuracy gain on objects beyond 30 m in clear weather" }
  - { value: "0.24%", label: "more model parameters than the baseline, at the same 5.3 frames per second" }
updated: 2026-10-26
---

## What problem does this research solve?

An automated vehicle can only plan around what it has detected. Its perception system has to find every car, pedestrian and cyclist around it and place each one as a 3D box: where it is, how big it is and which way it faces. Close objects are easy. Distant ones are not, because the sensors see them through only a handful of measurements.

<blockquote class="pull-quote">
  <p><strong>In computer vision, anything beyond 30 meters is usually called “long range”.</strong> On the road, 30 meters is not far at all: at 40 mph on an arterial it is about 1.7 seconds of travel, and at 75 mph on a freeway about 0.9 seconds. <strong>Long range is everyday driving, and those are the seconds the vehicle has to see, decide and react.</strong></p>
</blockquote>

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/near-far-points.png" alt="Bar chart for the View-of-Delft test set. Within 30 meters: 62.8% of objects and 94.4% of LiDAR points, about 344 points per object. Beyond 30 meters: 37.2% of objects but only 5.6% of points, about 34 points per object." loading="lazy" />
  <figcaption>More than a third of the objects in the test set are beyond 30 meters, but they receive less than 6% of the LiDAR points: about 34 points per object, against 344 for nearby objects. Chart drawn from Figure 1 of the paper.</figcaption>
</figure>

Bad weather makes it worse. In simulated heavy fog, the LiDAR keeps only about half of its returns within 20 meters, and about 7% of them beyond 60 meters. The paper notes that this is one reason automated vehicle deployments have favored mild-weather states such as Texas and Arizona over northern states like Pennsylvania. Cameras blur and lose contrast in fog too, so adding a camera does not fix the problem.

**4D radar** is the natural partner. It sees through fog and rain and measures each target's speed directly, but its picture is coarse and noisy. The open question is how to combine a sharp sensor that fades in fog with a robust sensor that is always sparse, without letting the gaps and the noise drown out the real objects.

## What did we do?

We built **ATN3D** ("Ask The Neighbor"), a detector that fuses LiDAR and 4D radar point clouds and is designed from the start for scenes where evidence is scarce. Like most detectors of this kind, it divides the space around the vehicle into a grid of small columns, or cells, and collects the points that fall into each one. Far away or in fog, most of those cells are empty, and many of the rest hold only a stray point or a false echo.

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/lidar-vs-radar.jpg" alt="Two bird's-eye views of a street scene with distance rings. Left, labeled LiDAR: dense colored points tracing streets and buildings. Right, labeled 4D radar: only a few scattered points." loading="lazy" />
  <figcaption>The two inputs ATN3D combines. LiDAR (left) draws sharp geometry; 4D radar (right) returns only a scattering of points, but keeps working in fog and measures speed. From the paper.</figcaption>
</figure>

ATN3D adds four pieces to a strong existing LiDAR-radar detector (L4DR, our baseline):

1. **Density-aware fusion.** Before LiDAR and radar are merged in a cell, the model records how many points each sensor saw there. It then knows how much each cell can be trusted, instead of treating a cell with one point the same as a cell with three hundred.
2. **Ask the neighbor.** A sparse cell borrows evidence from the cells around it, within a small circle (0.32 m). The key rule is that **only occupied cells get a say**: empty cells are gated out, so they cannot dilute or smear an object's outline. Neighbors are weighted by their true distance, which is why the search area is a circle rather than a square.
3. **Weather- and range-aware attention.** Late in the network, the model re-weights its internal features according to how good the evidence is, damping fog clutter and emphasizing the cues that still work at long range.
4. **Range-aware training.** Ordinary training is dominated by large, nearby, easy objects. We weight mistakes on distant objects more heavily, so the model learns to find them early.

We tested ATN3D on the View-of-Delft (VoD) dataset, recorded with a car carrying LiDAR and 4D radar in Delft, the Netherlands, for cars, pedestrians and cyclists. To test fog, we used the official fog version of VoD, in which mild and heavy fog are simulated in the LiDAR data and the radar is left unchanged. To check results under real weather, we also tested on the K-Radar dataset from South Korea, which includes overcast, fog, rain, sleet and snow.

## What is the key methodological contribution?

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/architecture.png" alt="Flow diagram: LiDAR and radar point clouds (radar first cleaned by a denoising step) go into density-aware LiDAR-radar fusion, then to a bird's-eye-view grid where O-GNA aggregates neighboring cells inside a circle, then a gated multi-scale fusion with separate LiDAR and radar features, the E-CSA channel attention module, a detection head, and range-aware classification and box losses." loading="lazy" />
  <figcaption>The ATN3D pipeline. The new parts are density-aware fusion at the input, occupancy-gated neighbor aggregation (O-GNA, the circle), channel attention (E-CSA) before the detection head, and range-aware losses for training. From the paper.</figcaption>
</figure>

Earlier LiDAR-radar detectors mix the two sensors without asking how much evidence each part of the scene actually has. Under extreme sparsity that backfires in two ways: empty and falsely occupied cells inject noise when the sensors are combined, and ordinary neighborhood operations then spread that noise into the cells around real objects. On top of that, training treats every object alike, so the few distant ones are under-learned.

ATN3D's contribution is to make **sparsity itself an input**. Each cell carries its point counts, aggregation listens only to occupied neighbors, and training is weighted by distance. The figure below shows why the gate matters.

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/gating-ablation.jpg" alt="Two bird's-eye feature maps of the same scene on a dark blue background. Left, labeled Without the gate: objects appear as speckled, scattered points. Right, labeled With the gate: the same objects appear as compact, well-defined clusters." loading="lazy" />
  <figcaption>The bird's-eye feature map after neighbor aggregation, without (left) and with (right) the occupancy gate. Without it, empty cells are pulled into the average and add noise around object edges; with it, objects come through as compact, well-defined clusters. From the paper.</figcaption>
</figure>

The extra parts are light. ATN3D has 62.22 million parameters against 62.07 million for the baseline (+0.24%), because the neighbor step has no learned parameters at all. On one RTX 6000 Ada GPU it runs at 189.3 ms per frame, the same 5.3 frames per second as the baseline.

## What are the key findings?

- **Most accurate at every fog level.** On VoD, ATN3D had the highest detection accuracy (mAP) of all six detectors compared, in clear weather (81.4), mild fog (79.6) and heavy fog (68.1). Its lead over the strongest baseline was largest in heavy fog (4.0 points).
- **Holds up better in fog.** For cars (easy cases), accuracy fell by 15.2 points from clear weather to heavy fog, less than for any other detector (16.5 for L4DR, about 18 for LiDAR-only detectors). For cyclists (easy cases) in heavy fog it reached 85.8 against 82.7 for the best baseline.
- **Sees farther.** Beyond 30 m in clear weather, ATN3D improved on the best baseline by 3.5 points for cars, 4.7 for pedestrians and 1.8 for cyclists. In heavy fog the gains beyond 30 m were 1.1, 2.1 and 3.0 points, and it lost less accuracy going from near to far (26% against 28.4%).
- **Every piece helps.** Adding the four parts one at a time raised accuracy step by step, from 72.5 to 76.1 in clear weather and from 61.3 to 69.7 in heavy fog (moderate difficulty), with the biggest gains in fog, where cells are sparsest.
- **Works in real weather.** On K-Radar, ATN3D scored best overall (81.6 bird's-eye and 55.8 3D accuracy, against 77.5 and 53.5 for L4DR). Its biggest margin was in real fog (92.1 and 75.8), and it was also best in heavy snow (39.7 3D). In rain and sleet it was slightly behind L4DR (by 0.5 points or less).

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/accuracy-by-fog.png" alt="Grouped bar chart of detection accuracy (mAP, %) at three fog levels. Clear: PointPillars 70.8, L4DR 78.9, ATN3D 81.4. Mild fog: 69.0, 77.9, 79.6. Heavy fog: 55.0, 64.1, 68.1." loading="lazy" />
  <figcaption>Detection accuracy on VoD as fog thickens, averaged over cars, pedestrians and cyclists and three difficulty levels. ATN3D leads at every level, and the gap to the strongest baseline (L4DR) is widest in heavy fog. Chart drawn from Table I of the paper.</figcaption>
</figure>

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/long-range-ap.png" alt="Two bar charts of 3D accuracy for objects beyond 30 meters. Clear weather: car 64.6 vs 68.1, pedestrian 59.5 vs 64.2, cyclist 70.9 vs 72.7 for L4DR vs ATN3D. Heavy fog: car 23.0 vs 24.1, pedestrian 14.7 vs 16.8, cyclist 19.7 vs 22.7." loading="lazy" />
  <figcaption>Accuracy on objects more than 30 m away, the ones a vehicle needs to see earliest. ATN3D beats the strongest baseline for every class in both conditions. Heavy fog lowers long-range accuracy sharply for both detectors, which shows how hard the problem still is. Chart drawn from Tables II and III of the paper.</figcaption>
</figure>

<figure>
  <img src="/media/biswas-atn3d-radar-lidar-tits-2027/detections.jpg" alt="Two bird's-eye feature maps with object boxes. White boxes mark the true objects with their distance from the vehicle, from about 4 to 53 meters; red dashed boxes mark ATN3D's detections with confidence scores. Most white boxes, including cars at 40 to 53 meters, have a matching red box." loading="lazy" />
  <figcaption>ATN3D's detections in two VoD scenes, seen from above. White boxes are the real objects, labeled with their distance; red dashed boxes are what ATN3D found, with its confidence. It picks up cars 40 to 53 meters away and misses only a few very small pedestrians. From the paper.</figcaption>
</figure>

There are limits. The VoD fog is simulated, and many of the objects ATN3D still misses are covered by a single grid cell, which leaves no neighbors to ask. Filling in such very sparse objects is the next step.

## What can this be used for?

- **Automated vehicle developers:** a practical recipe for LiDAR-radar perception in fog and at range that adds almost nothing to the computing budget, so it can drop into an existing detector.
- **Agencies in fog- and snow-prone regions, such as Pennsylvania:** evidence that pairing LiDAR with 4D radar, fused with attention to how sparse the data is, can extend reliable detection into the weather and distances where automated vehicles have struggled.
- **Safety and evaluation work:** a reminder to judge detectors separately by distance and weather. A single overall score hides the drop beyond 30 m, which is where reaction time is shortest.
