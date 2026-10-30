---
tldr: >-
  We built FGD-VO, a camera-only way for a vehicle to track its own motion when GPS drops out, which
  first lines up matching pixels between video frames and then ignores the matches it cannot trust;
  on the KITTI driving benchmark it cut mean trajectory error to 20.45 m, against 31.89 m for the
  best of six compared methods.
hero:
  image: /media/ding-fgd-vo-visual-odometry-ijtst-2026/kitti-trajectories.png
  alt: Eight bird's-eye maps of KITTI driving routes, each with an orange line for the path estimated by FGD-VO drawn over a blue line for the true path; in most maps the two lines almost coincide, including loops, sharp turns and long straight stretches
  caption: Where the car thinks it went (orange), estimated from a single front camera, against where it really went (blue), on eight KITTI driving routes. Over hundreds of meters of turns and loops the two lines stay close.
  credit: Ding et al. (2026)
affiliations:
  - The Pennsylvania State University
  - Stony Brook University
author_affiliations: [[1], [1], [2], [2], [2], [1]]
abstract: |-
  Visual odometry (VO) provides continuous ego-motion estimates for autonomous vehicles and remains an important localization component when Global Navigation Satellite System signals are degraded or unavailable. Recent learning-based monocular VO methods have shown promising performance, yet their accuracy is still strongly affected by the quality of inter-frame correspondences, namely the pixel-level associations between consecutive images used for motion estimation. In driving scenes, two issues are particularly important. First, spatially non-uniform image displacement caused by forward motion, nearby structures, and turning maneuvers makes implicit feature association insufficient. Second, unreliable correspondences can arise from independently moving objects, non-overlapping regions, illumination changes, and reflective road surfaces, but these regions are not always effectively suppressed before pose regression. To address these issues, we propose FGD-VO, a correspondence-centered monocular VO framework that explicitly combines flow-guided adaptive alignment with reliability-aware feature weighting. The Flow-Guided Deformable alignment module uses optical flow as a coarse correspondence prior and refines feature interaction with learnable local offsets, enabling more flexible alignment around flow-projected locations. The Dual-Path Reliability Masking strategy combines forward–backward flow consistency with a learned reliability branch to reduce the influence of unreliable correspondence regions. Experiments on the KITTI odometry benchmark show that FGD-VO improves overall monocular VO accuracy under the evaluated protocols, demonstrating the benefit of explicit correspondence alignment and reliability-aware weighting for driving-scene pose estimation. To further support reproducibility, we have open-sourced our complete project framework, including the implementation code and data processing pipelines, at https://github.com/yuxinpsu/FGD-VO.
key_numbers:
  - { value: "20.45 m", label: "mean trajectory error on KITTI test routes 07–10, against 31.89 m for the best of six compared methods" }
  - { value: "3.38%", label: "mean drift on KITTI routes 09 and 10, against 4.65% for the best of ten compared learning-based camera methods" }
  - { value: "4.89% vs 23.81%", label: "test drift with and without optical-flow guidance, the largest effect in the ablation study" }
  - { value: "5 FPS", label: "current speed (about 201 ms per frame pair), not yet real time" }
updated: 2026-10-26
---

## What problem does this research solve?

<blockquote class="pull-quote">
  <p>A self-driving car has to know where it is at every moment. <strong>Satellite positioning (GPS and other GNSS) does most of that work, but it degrades or drops out exactly where driving is hardest: in urban canyons, tunnels, under highway overpasses and at dense intersections.</strong> When that happens, the car falls back on estimating its own motion from its other sensors, frame by frame, the way a navigator does dead reckoning.</p>
</blockquote>

**Visual odometry (VO)** does this with a camera. It compares two consecutive video frames, works out how the scene appears to have shifted, and from that infers how the car moved: how far forward, and how much it turned. Chaining those small steps together gives a running path. A single camera is cheap and already on almost every automated vehicle, so monocular VO is an attractive backup. Its weakness is that small errors in each step add up into drift.

Most of those errors come from one place: the **correspondences**, the pixel-to-pixel matches between one frame and the next that say "this point in frame 1 is that point in frame 2." Driving makes good correspondences hard in two ways:

- **Things move by very different amounts.** At highway speed, nearby lane markings, guardrails and adjacent vehicles jump far across the image between frames, while a distant overpass barely moves. Turning at an intersection adds a large rotation on top. The same pixel position in two frames often shows entirely different parts of the scene.
- **Some matches are simply wrong.** Other vehicles, pedestrians and cyclists move on their own, which breaks the assumption that the world is standing still while the car moves. Areas at the image edge appear in one frame and vanish in the next. Sudden light changes at tunnel entrances, overpass shadows and reflections on wet pavement create matches with no real motion behind them.

Many learning-based VO models stack the two frames together and let a neural network figure out the matches implicitly. Others use **optical flow**, an estimate of how each pixel moved, to shift one frame onto the other, but that shift is rigid: one displacement per pixel, which breaks down at the edge of a car in front of the road behind it.

## What did we do?

We designed **FGD-VO**, a monocular VO model built around getting the correspondences right before estimating motion. It works in two steps: first **line up** the features of the two frames carefully, then **weigh** each region by how trustworthy its match is.

<figure>
  <img src="/media/ding-fgd-vo-visual-odometry-ijtst-2026/alignment-strategies.png" alt="Three diagrams. (a) Two stacked camera frames go straight into a neural network that outputs the car's rotation and translation. (b) A flow network adds pixel-motion estimates before the network. (c) FGD-VO: a flow network and an image backbone produce flow maps and feature maps; flow gives a coarse match, and several learnable sampling points around it are combined before the motion is estimated" loading="lazy" />
  <figcaption>Three ways to compare two frames. (a) Stack them and let the network guess the matches. (b) Use optical flow to shift one frame onto the other. (c) FGD-VO: use optical flow only as a first guess, then let the network look at several nearby points around that guess and combine them. From the paper.</figcaption>
</figure>

The model was trained and tested on the **KITTI odometry benchmark**, a widely used set of real driving recordings with accurate ground-truth paths for 11 routes (sequences 00–10). We used only the left color camera. Because earlier studies on KITTI do not all train and test on the same routes or report the same measures, we compared FGD-VO separately under each of the three set-ups most often used in the literature, rather than ranking everything in one table.

## What is the key methodological contribution?

FGD-VO splits the correspondence problem into two jobs and gives each its own module. Both run at four image scales, from coarse to fine, and the motion estimate is refined at each scale.

<figure>
  <img src="/media/ding-fgd-vo-visual-odometry-ijtst-2026/fgd-vo-overview.png" alt="Block diagram: images T and T-1 pass through a shared image backbone, and a frozen flow network computes forward and backward optical flow; at four layers from coarse (3) to fine (0), an FGD alignment block and a DPM weighting block produce a pose estimate that is passed to the next layer and supervised by a loss at every layer" loading="lazy" />
  <figcaption>How FGD-VO works. A pretrained optical-flow network (RAFT) and an image backbone process two consecutive frames. At each of four scales, the alignment module (FGD) lines up the features and the masking module (DPM) weighs them, and the car's estimated rotation and translation are refined from the coarsest scale to the finest. From the paper.</figcaption>
</figure>

1. **Flow-Guided Deformable (FGD) alignment.** Optical flow says roughly where each point went. Instead of trusting that single spot, FGD learns to sample **32 candidate points around it** and combines them with learned weights, then refines the result again with **9 neighboring samples**. The flow anchors the search in the right place; the learned offsets let it bend around depth edges and correct small flow errors.
2. **Dual-Path Reliability Masking (DPM).** Before the motion is estimated, every region gets a reliability weight from two sources. The **explicit** path is a geometry check: track a pixel forward with optical flow and back again; if it does not return to where it started, the match is suspect. The **learned** path is a small network that judges reliability from the image features themselves. The two are combined to decide how much each region counts.

The two paths fail in different places, which is why both are needed. The explicit check is sometimes too cautious and misses some outliers; the learned mask can be fooled by appearance. Combined, they focus on what is actually stable.

<figure>
  <img src="/media/ding-fgd-vo-visual-odometry-ijtst-2026/reliability-masks.png" alt="Three heat maps over the same highway image, colored from blue (low weight) to red (high weight). (a) Explicit weight: high almost everywhere except a few regions. (b) Implicit weight: highlights the sky band and a strip at the bottom right. (c) Hybrid weight: low over most of the image, with small high-weight spots on stable structures; dashed boxes mark the bottom-right corner and an upper-right region" loading="lazy" />
  <figcaption>The two reliability paths on one highway frame (blue = ignored, red = trusted). In the orange box, the bottom-right corner is visible in only one of the two frames: the geometry check (a) correctly marks it unreliable, but the learned mask (b) highlights it. In the green box, some outliers slip past the geometry check, and the learned mask makes them look even more important. The combined mask (c) suppresses both problem areas and keeps weight on stable parts of the scene. From the paper.</figcaption>
</figure>

## What are the key findings?

- **Lowest average errors under each set-up tested.** On KITTI routes 03–07 and 10, FGD-VO had the lowest mean translation and rotation errors of the five learning-based methods compared (4.48% and 2.07°/100 m, against 5.96% and 2.67°/100 m for the next best on each measure). On routes 09 and 10, the most common test pair, it had lower errors than all ten compared learning-based methods on both routes, with a mean drift of **3.38%**, roughly 3.4 m of position error per 100 m driven.
- **Lowest mean trajectory error against classic and hybrid systems.** Measured as the average distance between the estimated and true path on routes 07–10, FGD-VO scored **20.45 m**, compared with 31.89 m for ORB-SLAM2, and 39.20 m for ORB-SLAM3, two classic feature-tracking systems, and 44–57 m for four recent hybrid learning-and-geometry systems. Note that FGD-VO was trained on routes 00–06, while these systems need no training on KITTI.

<figure>
  <img src="/media/ding-fgd-vo-visual-odometry-ijtst-2026/ate-comparison.png" alt="Horizontal bar chart of mean absolute trajectory error in meters on KITTI sequences 07 to 10: FGD-VO 20.45, ORB-SLAM2 31.89, ORB-SLAM3 39.20, DROID-VO 44.36, MambaVO++ 45.21, DPV-SLAM++ 50.71, DPVO 56.73" loading="lazy" />
  <figcaption>Mean absolute trajectory error on KITTI routes 07–10 (Table 4 of the paper). FGD-VO has the lowest average, mainly because it does far better on routes 08 and 09; classic and hybrid systems still win on routes 07 and 10.</figcaption>
</figure>

- **The gains are on average, not everywhere.** Some methods beat FGD-VO on individual routes. Classic and hybrid SLAM systems, which add trajectory-level optimization, do better on routes 07 and 10, where sparse feature tracking is already reliable. FGD-VO only refines frame-to-frame matches and has no such global optimization.
- **Every part matters, and flow guidance matters most.** On held-out routes 07–10, removing the optical-flow guidance raised translation error from **4.89% to 23.81%**. Replacing the learned alignment with plain flow warping gave 15.84%, so the gain comes from the new alignment and masking, not from the flow network alone. Removing either reliability mask raised both errors. Removing both masks gave a slightly lower translation error (4.62%) but a higher rotation error (2.59 against 2.21°/100 m), so the masks mainly keep the heading estimate stable.

<figure>
  <img src="/media/ding-fgd-vo-visual-odometry-ijtst-2026/ablation.png" alt="Two horizontal bar charts side by side for seven model variants on KITTI test sequences 07 to 10. Translation error (%): full model 4.89, no reliability masks 4.62, no flow-consistency mask 7.38, no learned mask 5.96, no deformable sampling 5.61, plain flow warping only 15.84, no optical-flow guidance 23.81. Rotation error (degrees per 100 m): 2.21, 2.59, 3.30, 2.78, 3.28, 7.01, 11.92" loading="lazy" />
  <figcaption>What each part contributes (Table 6 of the paper). The full model (blue) has the lowest rotation error of all seven variants; only the version without masks has a slightly lower translation error. Without optical-flow guidance, both errors grow about five-fold.</figcaption>
</figure>

- **It degrades gracefully when the flow is poor.** When we added random noise to the optical flow, errors grew step by step (mean drift 4.89% with clean flow, 7.17% with 2-pixel noise, 17.73% with 10-pixel noise) rather than collapsing at once.
- **It is not yet fast enough for a car.** The full model runs at about **5 frames per second** (201 ms per frame pair on an NVIDIA RTX A6000 Ada GPU), most of it spent in the optical-flow network. It has also been tested only on KITTI, not yet at night, in bad weather, in dense city traffic or with other cameras.

## What can this be used for?

- **Backup localization when GPS fails.** A camera-based motion estimate that drifts less can help an automated vehicle hold its position through tunnels, under overpasses and in urban canyons until satellite positioning returns. This matters for applications such as our [driverless work-zone follow truck](/av-atma-field-testing-trr-2021/), which must keep tracking when GPS drops out.
- **A design lesson for camera-based perception.** Separating "where did each point go?" from "should we trust that match?" is a general recipe for any vision task that compares frames over time.
- **A fairer way to report results.** The paper organizes its comparisons by KITTI set-up, because published results use different training and test routes and measures, and explains why a single cross-paper ranking can mislead.
- **Next steps.** Lighter optical-flow estimation or a shared network for flow and features to reach real-time speed, and tests in more varied driving conditions and on other camera set-ups.
