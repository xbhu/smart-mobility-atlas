---
tldr: >-
  We let roadside fiducial markers hand automated vehicles a ready-made map of the lanes ahead, and
  taught the car's perception model how much to trust each marker; on a marker-augmented OpenLane-V2
  benchmark this improved lane centerline detection by 27% over vision alone, without needing GNSS or
  a global map.
hero:
  image: /media/wu-lane-topology-icra-2026/urban-lane-topology.jpg
  alt: Camera view of a city intersection with a school bus and cars ahead; colored lines drawn on the road trace the lanes, and thin lines connect each lane to the left-only, straight-only and right-only signs and the traffic lights above it
  caption: Lane topology reasoning at a city intersection. The car has to work out not just where each lane is (thick colored lines) but how lanes connect and which sign or signal governs each one (thin lines to the "ONLY" signs and lights). When a bus or truck blocks the view, a camera-only model loses parts of this picture.
  credit: Wu & Hu, ICRA 2026; street scene from OpenLane-V2 / Argoverse 2
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  Accurate lane topology perception is crucial for safe autonomous driving, yet vision-based models such as BEVFormer and TopoNet degrade under heavy occlusion and other visibility degradations (e.g., ambiguous road markings). Existing approaches augment vision with global priors like Standard Definition (SD) maps, but these rely on precise GNSS localization and global alignment, which can be unreliable in urban canyons, tunnels, or GNSS-denied areas. Fiducial markers provide a complementary alternative: compact infrastructure-embedded tags that encode structurally complete local lane graphs, mitigating blind spots in topology reasoning where visual pipelines fail. However, marker detections are not always reliable—pose estimates may degrade with distance, and detections may be intermittent under occlusion. To address these challenges, we propose a Confidence-Gated Marker Fusion framework that integrates marker-derived priors into BEV features through a dynamic gating mechanism, regulating the contribution of noisy long-range inputs. In addition, we introduce a temporal marker memory that caches and decays reliable priors across frames, propagating topology guidance during short-term detection gaps. Evaluated on a marker-augmented OpenLane-V2 benchmark, our method outperforms both vision-only and SD map-augmented baselines, achieving notable gains (27%) in lane graph completeness and occlusion robustness. These results demonstrate that fiducial marker priors, when fused with vision-based reasoning, provide a practical and reliable pathway toward resilient lane topology prediction in GNSS-denied urban scenarios.
key_numbers:
  - { value: "+27%", label: "lane centerline detection over the camera-only TopoNet model (36.2 vs 28.5)" }
  - { value: "2×", label: "lane-to-lane connectivity score compared with camera only (8.8 vs 4.1)" }
  - { value: "40.5", label: "overall OpenLane-V2 Score, the best of all methods tested, ahead of the SD-map approach (39.4)" }
  - { value: "1 m", label: "size of the single square marker placed near each complex intersection; no GNSS or global map needed" }
updated: 2026-10-26
---

## What problem does this research solve?

To drive through a city, an automated vehicle needs more than a picture of the road. It needs a **lane graph**: where every lane's centerline runs, which lane continues into which, where lanes merge and split, and which traffic light or turn sign applies to each lane. Building this graph on the fly, from the car's own cameras, is called **lane topology reasoning**.

<blockquote class="pull-quote">
  <p>Today's best camera-based models, such as BEVFormer and TopoNet, do this well when they can see. But city streets are full of things that block the view. A bus or a delivery truck can hide two lanes at once; trees, parked cars and faded paint hide the rest. <strong>Whatever the cameras cannot see, the model cannot reason about: a lane that is never detected never appears in the graph.</strong></p>
</blockquote>

A common fix is to give the car a map. Recent work (SMERF) feeds a Standard Definition (SD) navigation map into the model as a prior. This helps, but only if the car knows exactly where it is on that map, which means precise GNSS. In urban canyons between tall buildings, in tunnels and in other GNSS-denied places, that alignment fails, and maps can also be out of date in construction zones.

This paper asks a different question: **what if the road itself told the car how its lanes are laid out?**

## What did we do?

We used **fiducial markers**, square black-and-white tags such as ArUco and AprilTag that a camera can detect reliably and from which it can compute its exact distance and angle. A marker carries only a short ID, but that is enough: the ID points to a **complete local lane graph** (the lane centerlines and how they connect) stored in the vehicle's onboard database. Mounted on a pole, a traffic signal or a gantry at a complex intersection, a marker up to about one meter across gives the car the full lane layout of that intersection the moment it is seen, with no GNSS and no global map registration.

<figure>
  <img src="/media/wu-lane-topology-icra-2026/carla-marker-signal.jpg" alt="Simulated city intersection seen from just above a car's hood, with a black-and-white fiducial marker mounted between two traffic signals over the road" loading="lazy" />
  <figcaption>The idea in a driving simulator: a fiducial marker mounted with the traffic signals, as the car's camera sees it. Reading the marker's ID tells the car the lane layout of the intersection ahead, including lanes that buses or trucks are hiding. Image: Smart Mobility Lab, Penn State (CARLA simulator).</figcaption>
</figure>

Markers are not perfect sensors, though, and the paper's main work is dealing with their two weaknesses:

- **They get less accurate with distance.** A one-meter tag is small. Far away, a few pixels of error turn into meters of error in where the car thinks the marker, and so the whole lane graph, sits.
- **They come and go.** A passing vehicle can block the marker for several frames, or the car may simply be between markers.

<figure>
  <img src="/media/wu-lane-topology-icra-2026/marker-noise-vs-distance.png" alt="Line chart against distance from 0 to 60 meters: mean pose error (blue) stays below 1 meter up to about 25 meters, then climbs steeply to about 4 meters at 55 meters; detection rate (red dashed) falls gently from nearly 1.0 to about 0.7" loading="lazy" />
  <figcaption>How we simulated marker errors. Position error (blue) grows sharply beyond about 30 meters, while the chance of detecting the marker at all (red) drops. These settings were calibrated against published measurements of real ArUco markers. Image: from the paper.</figcaption>
</figure>

To test the idea, we added virtual markers to **OpenLane-V2**, a large public benchmark for lane topology built on real city driving scenes from Argoverse 2. Each scene got one 1&nbsp;m × 1&nbsp;m ArUco marker near a complex part of the road, such as an intersection, visible only as the vehicle approached it. We deliberately made the markers unreliable: position errors growing to 3 m (standard deviation) and orientation errors to 2° at 60 m, rare but extreme "jumps" of about 25 m and 90° (5% of the time) mimicking glare or reflections, and missed detections that become more frequent with distance.

## What is the key methodological contribution?

We built on TopoNet, a state-of-the-art camera-only model, and added a marker branch that feeds the retrieved lane graph into the model's bird's-eye-view (BEV) picture of the scene. Two ideas make it robust:

<figure>
  <img src="/media/wu-lane-topology-icra-2026/framework.png" alt="Flow diagram in two panels. Top, marker augmentation network: a marker leads to pose estimation and lane graph retrieval, the lane centerlines go through a marker feature encoder into marker tokens and a temporal marker memory, and together with a confidence score feed a red confidence-gated cross-attention block. Bottom, vision-only model: a car with a ring of cameras, multi-view images, image backbone, BEV queries, BEV constructor and decoder producing topology predictions; the red block feeds into the BEV constructor" loading="lazy" />
  <figcaption>The framework. Bottom: the usual camera-only pipeline turns the surround-view camera images into a bird's-eye-view picture and decodes it into a lane graph. Top: when a marker is seen, its lane graph is retrieved, encoded, scored for confidence and stored in memory, then blended into the bird's-eye view (red block). Image: from the paper.</figcaption>
</figure>

1. **Confidence-gated fusion.** Every marker detection gets a confidence score between 0 and 1 that falls off with distance and with how much the marker's lane graph jumps around from frame to frame. The marker's information is then mixed into the camera features in proportion to that score. A nearby, steady marker has a strong say; a distant or jittery one is mostly ignored. The camera picture is always kept, so when there is no marker the model behaves like the original.
2. **Temporal marker memory.** The model remembers the marker lane graphs it has seen in recent frames. When the marker disappears behind a truck, or its confidence drops too low, the model uses the remembered graph instead, while steadily discounting older memories so stale or misplaced information fades out.

A third, smaller design choice also mattered: we encode each lane line as a sequence of points with a Transformer and sinusoidal position codes, so the model sees the shape and continuity of each lane rather than a loose set of coordinates.

## What are the key findings?

Compared with the camera-only models, adding markers lifted lane centerline detection from 28.5 to **36.2 (+27%)** and roughly **doubled** the lane-to-lane connectivity score (4.1 to 8.8). It also beat the SD-map approach, which needs GNSS, on both measures, and earned the highest overall OpenLane-V2 Score.

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Method</th><th scope="col" class="num">Lane detection (DET<sub>l</sub>)</th><th scope="col" class="num">Lane connectivity (TOP<sub>ll</sub>)</th><th scope="col" class="num">Lane-to-sign links (TOP<sub>lt</sub>)</th><th scope="col" class="num">Overall score (OLS)</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">BEVFormer-DeTR<span>cameras only</span></th><td class="num">17.0</td><td class="num">2.3</td><td class="num">16.2</td><td class="num">30.2</td></tr>
        <tr><th scope="row">TopoNet<span>cameras only</span></th><td class="num">28.5</td><td class="num">4.1</td><td class="num">20.6</td><td class="num">34.7</td></tr>
        <tr><th scope="row">TopoNet + SMERF<span>cameras + SD map, needs GNSS</span></th><td class="num">33.4</td><td class="num">7.5</td><td class="num"><strong>23.4</strong></td><td class="num">39.4</td></tr>
        <tr class="is-highlight"><th scope="row">Ours<span>cameras + fiducial markers</span></th><td class="num"><strong>36.2</strong></td><td class="num"><strong>8.8</strong></td><td class="num">22.6</td><td class="num"><strong>40.5</strong></td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Results on the marker-augmented OpenLane-V2 benchmark, from Table I of the paper (higher is better). Markers help most with finding lanes and how they connect. Linking lanes to traffic signs, information the markers do not carry, improves less and stays slightly behind the SD-map approach.</figcaption>
</figure>

The difference is easiest to see in a heavily occluded scene. In the example below, a box truck and roadside trees hide several lanes. The camera-only model leaves gaps in the lane lines and loses connections at the intersections; with marker priors, the missing lanes come back and the lane-to-lane connections are preserved.

<figure>
  <img src="/media/wu-lane-topology-icra-2026/occlusion-comparison.png" alt="Four panels: a front camera photo of a street with a white box truck on the left and a tree overhanging the right; then three bird's-eye lane maps in blue labeled Ground Truth, TopoNet and Ours. TopoNet's lanes have gaps in the middle and broken connections at the intersections; Ours is continuous and close to the ground truth" loading="lazy" />
  <figcaption>An occluded street. From left: what the front camera sees, the true lane graph, the camera-only TopoNet prediction (broken lanes, fragmented intersections), and our prediction with marker priors (lanes recovered and connected). Image: from the paper; street scene from OpenLane-V2 / Argoverse 2.</figcaption>
</figure>

The ablation experiments show that **how** marker information is used matters as much as having it:

- Mixing in every marker equally, regardless of confidence, gave an overall score of only 33.6, below the camera-only TopoNet (34.7): noisy markers can do more harm than good. Simply discarding low-confidence markers did a little better (34.5). Weighting them by confidence gave 40.5.
- Without the memory, the overall score fell to 36.1, because the model lost the lane graph as soon as the marker was hidden. Memory without the gradual discounting reached 40.0; the full design reached 40.5.
- Encoding lane lines with a simple network (MLP) instead of the Transformer with position codes cut the score to 31.8.

## What can this be used for?

- **Transportation agencies** could install a small number of inexpensive, passive markers only where the road is hardest to read: complex intersections, merges and splits, tunnels, urban canyons, and construction zones where maps go out of date. The paper presents this as a low-cost alternative to maintaining dense HD maps or vehicle-to-everything (V2X) roadside equipment everywhere.
- **Automated vehicle developers** get a way to add infrastructure information to a camera-based model safely: the model leans on markers only when they are trustworthy and falls back to its own cameras when they are not.
- **Researchers**: the paper points to two next steps. Markers could encode lane connectivity directly, not only lane geometry, and marker detection, pose estimation and lane reasoning could be learned together end to end rather than in two separate stages.

This work builds on our [review of markers for automated vehicles](/wu-markers-review-iavvc-2025/), which compared visual markers, road-embedded magnets and wireless tags. Here we take one of those, the fiducial marker, and show how it can feed directly into a car's understanding of the road.
