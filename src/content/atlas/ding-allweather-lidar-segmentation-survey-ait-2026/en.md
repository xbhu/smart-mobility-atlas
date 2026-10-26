---
tldr: >-
  We surveyed how self-driving cars' LiDAR "scene labeling" holds up in fog, rain and snow, showed
  that weather corrupts LiDAR in structured, physics-driven ways rather than as random noise, and found
  that methods which manage unreliable evidence inside the network (reaching 42.5% mIoU on real
  adverse-weather scans) beat methods that only add simulated weather to the training data.
hero:
  image: /media/ding-allweather-lidar-segmentation-survey-ait-2026/clear-fog-snow-pointclouds.png
  alt: Three labeled LiDAR point clouds of the same kind of road scene in clear weather, fog and snow; in fog a thick black ring of unlabeled points surrounds the car, and in snow black speckles are scattered over the road near the car
  caption: The same LiDAR, three kinds of weather. In fog, a dense ring of false returns (black) surrounds the car and far objects thin out; in snow, speckle-like clutter from snowflakes covers the road near the car. Colors are the semantic labels a self-driving car has to predict for every point.
  credit: Ding et al. (2026)
affiliations:
  - The Pennsylvania State University
  - Stony Brook University
author_affiliations: [[1], [1], [2], [2], [2], [1]]
abstract: |-
  This paper presents a comprehensive survey of adverse-weather robustness for 3D LiDAR semantic segmentation in autonomous driving. With the push toward safe, trustworthy, and operationally reliable autonomy beyond clear-day operation, robust 3D perception under fog, rain, snow, spray, or dust has emerged as a core barrier to expanding the operational design domain (ODD) and providing safety assurance in real-world deployment, rather than a purely algorithmic objective. LiDAR segmentation performance can degrade sharply due to structured sensing degradation, including precipitation-induced clutter, range-dependent attenuation, wet-surface ground dropouts, and radiometric distortions in the intensity channel. To support systematic research and fair comparison, we first formulate the task and clarify the most common learning protocols—domain generalization (DG), unsupervised domain adaptation (UDA), and test-time adaptation (TTA)—which differ in when target-domain information is accessible. We then analyze weather-induced domain shift from both a physics/measurement perspective and a learning perspective, and distill practical design implications. Building on this analysis, we organize representative methods with a protocol-aware, two-axis taxonomy that couples the learning setting (DG/UDA/TTA) with the pipeline intervention level (input/preprocess, representation, and objective/prediction). We further summarize datasets and evaluation metrics, and compile reported cross-domain performance on a common real-world adverse-weather benchmark (SemanticSTF) under as consistent a backbone setting as possible. Finally, we close with a benchmarking-oriented synthesis, and open research directions toward reliable all-weather LiDAR semantic segmentation.
key_numbers:
  - { value: "19", label: "weather-focused methods sorted by when they see adverse-weather data and where in the pipeline they act" }
  - { value: "21", label: "outdoor LiDAR datasets catalogued, real and synthetic, clear and adverse weather" }
  - { value: "42.5%", label: "best reported mIoU on real fog, rain and snow scans for a model trained only on clear-weather data, against 28.4% for an input-only baseline" }
  - { value: "24.4 → 37.3", label: "mIoU gain reported when a standard model simply stops using the LiDAR intensity channel" }
updated: 2026-10-25
---

## What problem does this research solve?

A self-driving car's LiDAR sweeps laser beams around the vehicle and records a dense cloud of 3D points, scan after scan. **Semantic segmentation** is the step that labels every one of those points: road, sidewalk, car, pedestrian, building, vegetation, pole. Those labels tell the planner where the drivable space ends and what the obstacles are, so when segmentation goes wrong, the error does not stay in the perception module. A misplaced road edge or a missed pedestrian flows straight into driving decisions.

Most segmentation models are trained and tested on clear-day data. In **fog, rain, snow, road spray or dust**, the same model can degrade sharply. That is a practical barrier to deployment: an automated vehicle's operational design domain (ODD), the conditions it is approved to drive in, cannot be extended to bad weather unless its perception can be shown to stay reliable there.

The research community has a rich toolbox for making 3D models robust when conditions change, and several surveys of it. But almost all of that work was built and tested for "clear-to-clear" transfers, such as moving from one city, sensor or dataset to another. Adverse weather is a different kind of shift: the scene itself is the same, but **the measurements become unreliable**, with missing returns, false points and range-dependent losses. When papers mix the two kinds of shift, it is hard to tell whether a reported gain comes from handling weather or from general transfer effects. And because papers differ in what adverse-weather data they were allowed to use and how they were evaluated, their numbers are often not comparable.

## What did we do?

We wrote a dedicated, weather-first survey of LiDAR semantic segmentation for autonomous driving. It does four things:

1. **Sets fair rules for comparison.** Methods are grouped by when they are allowed to see adverse-weather data. **Domain generalization (DG)** trains only on labeled clear-weather scans and never sees bad weather before deployment. **Unsupervised domain adaptation (UDA)** may also use unlabeled scans recorded in bad weather. **Test-time adaptation (TTA)** keeps adjusting the model on the fly while the car drives, under tight limits on time, memory and safety. A DG method and a UDA method tuned on plenty of target scans are solving related but different problems, so their numbers should not be ranked side by side.
2. **Explains, from sensor physics, what weather does to LiDAR**, and draws design lessons from it.
3. **Organizes the methods in a two-axis taxonomy**: the learning setting (DG, UDA or TTA) crossed with the place in the pipeline where a method intervenes.
4. **Catalogues the datasets and metrics** and compiles reported results on a common real-world adverse-weather benchmark, SemanticSTF, under as consistent a setup as possible.

## How does bad weather corrupt LiDAR?

The paper's central observation is that adverse weather does **not** simply add random noise. It changes the measurement process in structured, distance-dependent ways, and these fall into two groups.

**Geometric effects change where points appear.**

- **Clutter near the car.** Raindrops and snowflakes scatter part of the laser energy back before it reaches a real surface. Strong enough echoes show up as false points close to the vehicle ("ghost echoes"), which are easy to mistake for small objects and partially hide real cars and pedestrians.
- **Lost range.** Fog and heavy rain absorb and scatter the beam along its path, so the energy returning from distant surfaces drops roughly exponentially with distance. Once it falls below the sensor's detection threshold the point is simply gone, and far-away curbs, buildings and road edges vanish. The car is left with a much shorter effective horizon, which matters most at speed and near intersections.
- **Holes in a wet road.** Water films and slush make the road surface mirror-like, so the beam bounces away instead of back. The ground plane, which many pipelines rely on as a stable reference, develops "black holes," and models start confusing road with sidewalk exactly where free-space estimates must be reliable.

<figure>
  <img src="/media/ding-allweather-lidar-segmentation-survey-ait-2026/bev-clear-fog-rain.png" alt="Three bird's-eye views of a LiDAR scan on a black background, clear, fog and rain; zoomed insets show a red band of clutter points around the car in fog and a few red points in rain, and the far-field structures are fainter in the fog and rain views" loading="lazy" />
  <figcaption>The same scan seen from above in clear weather and with simulated fog and rain. Weather adds a band of clutter close to the car (red points in the zooms) and erases structures farther away, yet the overall street layout stays recognizable. From the paper, using widely used physics-based weather simulators.</figcaption>
</figure>

**Intensity effects change what each point says.** Besides position, a LiDAR records the strength of each return, called **intensity** or reflectance. It carries hints about the material a point belongs to, much like color in a camera image, so many models lean on it. But in fog, rain or snow the returning signal is weakened along the way, the return pulse gets smeared, and wet surfaces reflect unpredictably. The same material at the same distance can look systematically "dimmer" than on a clear day.

<figure>
  <img src="/media/ding-allweather-lidar-segmentation-survey-ait-2026/intensity-range-view.png" alt="Three panoramic intensity images of the same street scene, clear, fog and rain; the clear and rain images show detailed purple and orange structures, while the fog image is almost entirely black with a few bright specks" loading="lazy" />
  <figcaption>The intensity channel of one scan unrolled into a panorama. In fog it collapses to almost nothing, with only a few unreliable bright spikes; rain is milder but still shifts and smooths the pattern. From the paper.</figcaption>
</figure>

To check this across whole datasets, we compared the distribution of point distances and of intensity values in a clear-weather dataset (SemanticKITTI), a real adverse-weather dataset (SemanticSTF) and weather-corrupted versions of SemanticKITTI.

<figure>
  <img src="/media/ding-allweather-lidar-segmentation-survey-ait-2026/distance-intensity-ecdf.png" alt="Two cumulative distribution plots. Left, point distance: the four datasets' curves nearly overlap. Right, reflectance: the fog curve rises steeply and reaches about 0.9 by a reflectance of 0.2, while the real adverse-weather dataset rises slowly across the whole range" loading="lazy" />
  <figcaption>Geometry is a stable anchor; intensity is not. Left: the distance distributions of clear, real adverse-weather and simulated fog and snow data nearly coincide. Right: their intensity distributions pull apart. Under simulated fog, nearly 80% of points have a normalized intensity of 0.2 or less. From the paper.</figcaption>
</figure>

This leads to the design lessons that run through the rest of the review. Models should tell **"missing or uncertain evidence"** apart from a real change in the scene, so that clutter is not labeled as objects and empty patches are not labeled with false confidence. **Geometry** can serve as the anchor for consistency across weather, while **intensity** should be trusted only selectively: calibrated, gated or conditioned on how reliable the measurement looks.

## What is the key methodological contribution?

The survey's taxonomy ties each method to the physics above. Besides the learning setting (DG, UDA or TTA), every method gets one primary tag for **where** its main idea acts in the perception pipeline.

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Intervention level</th><th scope="col">What it changes</th><th scope="col">Typical techniques</th><th scope="col">Strength and limit</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">B1 Input<span>input space / preprocessing</span></th><td>The raw point cloud, before the network sees it</td><td>Physics-based fog, rain and snow simulation; learned point dropping; mixing weather artifacts into clean scans (e.g. PointDR, UniMix, LAWA)</td><td>Model-agnostic and easy to plug in; gains level off when weather removes information rather than adding removable noise</td></tr>
        <tr class="is-highlight"><th scope="row">B2 Representation<span>feature space</span></th><td>How features are built and calibrated inside the network</td><td>Separate geometry and intensity branches that are fused carefully; modeling feature uncertainty; keeping class structure intact across weather (e.g. GRC, DGUIL, NTN, NormFusion)</td><td>Stops corrupted cues from spreading through the network; the strongest results on the common benchmark</td></tr>
        <tr><th scope="row">B3 Objective<span>training signal / prediction</span></th><td>What the model is trained to agree with</td><td>Pseudo-labels on unlabeled bad-weather scans with confidence filtering; consistency between dense and sparse views; up-weighting fragile regions (e.g. Robo3D, HGL, SSMix)</td><td>Directly controls what the model trusts; pseudo-labels can turn brittle and reinforce early mistakes when weather is severe</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>The three intervention levels of the taxonomy, summarized from Section 5 and Tables 2-4 of the paper. Each of the 19 weather-focused methods reviewed is also tagged DG, UDA or TTA.</figcaption>
</figure>

We deliberately left out the large body of 3D adaptation work that was validated only on clear-weather transfers, and LiDAR "de-raining" or "de-fogging" filters that are not tested on segmentation. Weather-focused segmentation papers only began to appear in numbers from 2024 onward, once real adverse-weather benchmarks such as SemanticSTF (released in 2023) made such studies possible.

The review also catalogues **21 outdoor LiDAR datasets** with point-level labels, from real clear-weather collections (SemanticKITTI, nuScenes, Waymo) to real adverse-weather sets (SemanticSTF, WADS for heavy snow, SemanticSpray for road spray) and synthetic or corrupted ones (SynLiDAR, SemanticKITTI-C, Weather-KITTI). SemanticSTF, recorded with a 64-beam LiDAR across Germany, Sweden, Denmark and Finland, provides 2,076 labeled scans in snow, dense fog, light fog and rain and has become the standard real-world test set.

## What are the key findings?

We compiled reported scores on SemanticSTF for models trained on clear-weather data, restricted to one backbone network family (MinkUNet) and the common 19-class evaluation protocol, so that the numbers are as comparable as possible. The score is **mIoU** (mean intersection-over-union): how well the predicted points of each class overlap the true ones, averaged over classes.

<figure>
  <img src="/media/ding-allweather-lidar-segmentation-survey-ait-2026/semanticstf-miou.png" alt="Horizontal bar chart of mIoU on SemanticSTF by method, colored by intervention level. Domain generalization: GRC 42.5 (B2), Park et al. 39.5 (B1), Cheong et al. 39.2 (B3), NTN 38.9 (B2), He et al. 37.5 (B2), DGUIL 35.5 (B2), UniMix 31.4 (B1), Liao et al. 30.0 (B2), PointDR 28.4 (B1). Unsupervised domain adaptation: UniMix 37.2 (B1), SSMix 32.3 (B3)" loading="lazy" />
  <figcaption>Reported accuracy on real fog, rain and snow scans for models trained on clear-weather SemanticKITTI (Table 5 of the paper). Representation-level methods (B2, orange) hold the top score and most of the strong second tier. Results come from the original papers, not a single re-run, so read them as trends rather than an exact ranking.</figcaption>
</figure>

- **Much of the weather gap can be closed without ever seeing bad weather in training.** The best clear-weather-only (DG) model reached **42.5% mIoU** (GRC), and several others clustered between 37.5% and 39.5%. The broad input-randomization baseline PointDR reached only 28.4%: generic perturbations do not cover the structured damage that real weather does.
- **Robustness is won mainly in the feature space.** Methods that separate geometry from intensity, calibrate feature statistics or keep the class structure stable inside the network (B2) were the most effective overall. Adding weather to the input (B1) is a strong, portable baseline but tends to level off; training-signal methods (B3) help only when the pseudo-labels or consistency targets can be kept reliable.
- **Intensity is a double-edged cue.** In an ablation reported by the GRC study, a standard sparse-convolution model (MinkNet) improved from **24.4% to 37.3% mIoU** on the benchmark just by **dropping the intensity input**, which turned "geometry only" into a baseline that matches or beats many heavier schemes. Intensity is informative in clear weather but should be handled separately and switched on only when it can be trusted.
- **More unlabeled bad-weather data does not automatically help.** With unlabeled SemanticSTF scans available (UDA), the reported scores (37.2% and 32.3%) did not beat the best DG result, because clutter and missing returns make pseudo-labels brittle. Adaptation did pay off in the harder synthetic-to-real transfer (SynLiDAR to SemanticSTF), where the best score was 26.7% under UDA, against a range of 18.5% to 26.3% for DG methods.
- **Test-time adaptation is the least explored setting**, even though it is the closest to real driving, where the weather can change from clear to fog to spray within one trip.

<figure>
  <img src="/media/ding-allweather-lidar-segmentation-survey-ait-2026/semanticstf-qualitative.png" alt="Three labeled point clouds of the same adverse-weather scene: ground truth, PointDR and DGUIL; zoomed insets show PointDR mislabeling a vehicle and nearby road points while DGUIL's labels are closer to the ground truth" loading="lazy" />
  <figcaption>One SemanticSTF scene labeled by the ground truth, an input-level method (PointDR, B1) and a representation-level method (DGUIL, B2). In the zoomed regions, DGUIL gives cleaner, more coherent labels with fewer fragmented errors. Errors concentrate where evidence is ambiguous or far away. From the paper.</figcaption>
</figure>

The paper closes with three research directions: moving beyond hand-built weather simulators toward **statistical "canonicalization" of features**, so that weather-induced drift is absorbed early in the network; **physics-consistent handling of intensity**, with separate encoding, calibration and reliability gates that decide when intensity is trusted; and **safe, efficient test-time adaptation** that updates only a few parameters, adapts only when confident, and can detect and reset runaway drift.

## What can this be used for?

- **Automated-vehicle developers and safety engineers**: A map of which robustness techniques address which weather failure (clutter, lost range, wet-road holes, intensity drift), and evidence that the most dependable recipe is hybrid: realistic weather exposure in training combined with feature- or loss-level mechanisms that gate unreliable cues.
- **Regulators and DOTs reviewing ODD claims**: A checklist for reading robustness results. Ask which learning setting a number comes from, which real adverse-weather data it was tested on, and whether clear-weather accuracy was kept.
- **Researchers**: A protocol-aware framework for fair comparison, a catalogue of 21 datasets for choosing training and test pairs, a consolidated benchmark table and three concrete open problems.
- **Students new to the field**: A plain physical account of why fog, rain and snow break LiDAR perception, before diving into any particular model.
