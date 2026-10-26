---
tldr: >-
  We built Safer3D, a camera-only 3D object detector that sharpens image detail for far-away objects,
  stops small objects from being thrown out early, and keeps track of partly hidden pedestrians and
  barrels, and on the Argoverse 2 benchmark it beat both the best camera-based method and three
  LiDAR-based detectors.
hero:
  image: /media/biswas-safer3d-multiview-wacv-2027/detections-far-and-occluded.jpg
  alt: Six road scenes with green 3D boxes and yellow distance labels. Top row, objects detected 85 to 141 meters ahead on long straight roads. Bottom row, pedestrians partly hidden behind a palm tree and behind a parked SUV, and orange construction barrels and cones on a city street.
  caption: What Safer3D sees from ordinary car cameras. Top, objects detected up to 141 meters ahead, where they are only a few pixels tall. Bottom, pedestrians half hidden behind a tree or a parked SUV, and construction barrels and cones. Yellow labels give each object's distance from the car.
  credit: "From the paper; camera images from the Argoverse 2 dataset (CC BY-NC-SA 4.0)"
affiliations:
  - The Pennsylvania State University
  - Stony Brook University
author_affiliations: [[1], [1], [2], [2], [2], [1]]
abstract: |-
  In modern autonomous driving, the perception system is indispensable for accurately assessing the surrounding environment, needed for safe and accurate prediction and planning. In recent years, 3D object detection has been a reliable perception backbone for an autonomous vehicle (AV) system. However, considering the complex practical scenarios, accurate detection of small and occluded targets is a major challenge for autonomous driving with limited on-board computational resources. Existing state-of-the-art (SOTA) methods use a sparse query-based framework that leverages high-quality 2D object priors to generate 3D queries to improve recall for distant objects. We argue that this 2D prior-based supervision alone is insufficient to effectively detect small, occluded objects for safety-critical AV perception. In this work, we propose a safety-critical framework, Safer3D, that pivots on query-based multi-view 3D object detection with spatial feature upsampling and salient temporal object ranking to improve the detection of small and occluded objects. To effectively recognize distant small objects, we propose using super-resolution (SR) to zoom in on spatial features and sharpen object boundaries. We also propose a new size-adaptive query selection (SAQS) criterion to effectively select low-confidence small objects. Finally, to improve the recall on occulted and rare objects, we propose a query-based scene graph network for saliency-ranked query propagation (SRQP). Our proposed Safer3D demonstrated SOTA performance on Argoverse 2 and nuScenes benchmark datasets, over a range of up to 152 meters. Our proposed modules are dataset-agnostic and can be coupled with any query-based detection network to improve performance.
key_numbers:
  - { value: "152 m", label: "detection range tested on Argoverse 2, across 26 object classes" }
  - { value: "32.7%", label: "mAP from cameras alone, above the best LiDAR detector tested (30.7%)" }
  - { value: "+3.2", label: "points of pedestrian detection accuracy (AP) over the Far3D baseline" }
  - { value: "≈4%", label: "higher recall than Far3D, with the largest gains at 50–150 m" }
updated: 2026-10-25
---

## What problem does this research solve?

A self-driving car can only brake for what it sees. At highway speed that means seeing far: a car at 130 km/h (80 mph) needs to spot an obstacle at least **150 meters** ahead to leave enough time to decide and stop safely, and at 60 mph a typical stopping distance is already 73 meters, more on a wet road. What computer-vision papers call "long range", beyond 100 meters, leaves only about 1.8 seconds on the road.

Far-away objects are not rare. On the Argoverse 2 driving dataset, **54% of labeled objects are more than 50 meters away and 20% are more than 100 meters away**. Beyond 100 meters a car is only a few pixels tall in a camera image, and a LiDAR scanner returns on average fewer than four points per object.

The second problem is closer to home. In city traffic, pedestrians, cyclists, road workers, cones and barrels are often partly hidden behind trees, poles, billboards or parked cars. These **vulnerable road users (VRUs)** and work-zone objects are exactly the ones a car must not miss.

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/long-range-challenge.jpg" alt="Four camera views. Top, two long straight roads where the labeled vehicles are tiny boxes near the horizon. Bottom, a street where several pedestrians are hidden behind a large SUV, and a sidewalk where people stand behind palm trees. A table below shows that 54 percent of objects are beyond 50 meters, 21 percent beyond 100 meters, and objects beyond 100 meters get on average 3.84 LiDAR points each." loading="lazy" />
  <figcaption>The two hard cases. Top, distant objects that are only a few pixels tall. Bottom, people partly hidden behind an SUV and behind palm trees. The table shows how objects in Argoverse 2 are spread by distance, and how few LiDAR points (“pts/box”) the far ones get. From the paper; camera images from Argoverse 2 (CC BY-NC-SA 4.0).</figcaption>
</figure>

Cameras are cheap, see far and capture rich detail, so recent detectors build a full 3D picture from the ring of cameras around the car. The best of them first find objects in the flat 2D images, then turn those finds into 3D "queries" (candidate objects the model then refines) and carry the strongest ones forward from frame to frame. But they treat every candidate the same way: small, faint, far-away objects score low and get dropped, and the candidates carried to the next frame are simply the most confident ones, not the ones that are hidden or rare.

## What did we do?

We built **Safer3D**, a camera-only 3D detector designed around the objects that matter most for safety: small, distant and partly hidden ones. It takes the images from all the cameras on the car (seven on Argoverse 2, six on nuScenes) and outputs a 3D box, class and distance for every object around the vehicle. Safer3D adds three lightweight modules to a strong existing detector (Far3D):

1. **Sharper detail for far objects (SRFE).** Before looking for objects, a small super-resolution step "zooms in" on the image features, restoring the fine edges that blur away for objects only about 10 pixels wide.
2. **Size-aware selection (SAQS).** When picking which 2D detections become 3D candidates, Safer3D gives small boxes a boost instead of ranking by confidence alone, so a faint, distant car is not thrown out just because it looks less certain than a nearby one.
3. **Remembering what is hidden (SRQP).** Each candidate object becomes a node in a scene graph that knows where objects are relative to each other (in front, behind, overlapping). The graph scores how *salient* each object is, and the most salient ones, often partly hidden or isolated, are carried into the next frames.

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/safer3d-architecture.png" alt="Flow diagram. Six camera images enter a backbone network. A super-resolution feature enhancement block refines the features. A 2D detection head finds boxes, a size-adaptive query selection block picks candidates, and a transformer combines them with fixed queries and a query memory bank. A scene graph of objects such as person, vehicle and tree ranks queries before they update the memory bank." loading="lazy" />
  <figcaption>How Safer3D works. Camera images (left) pass through the super-resolution feature enhancement (top), size-adaptive query selection (bottom) and a 3D transformer. The scene graph (top right) ranks which objects to remember in the memory bank for the next frames. From the paper.</figcaption>
</figure>

We tested Safer3D on two public benchmarks: **Argoverse 2** (1,000 scenes, 26 object classes, objects labeled out to 152 meters) and **nuScenes** (1,000 scenes, 10 classes, out to 80 meters).

## What is the key methodological contribution?

Most detectors decide which objects to keep, and which to remember, by one number: how confident they are. Safer3D changes both decisions.

- **Size into the selection score.** Each 2D box gets a "smallness prior" that is high for small boxes and decays smoothly for large ones. Multiplied with the usual confidence score, it still rejects clear non-objects but re-ranks the rest so small, distant objects survive.
- **Geometry into what is remembered.** The scene graph uses each object's 3D position, speed, confidence and appearance, plus the distance and direction between every pair of objects. That lets it notice a low-confidence pedestrian standing just behind a high-confidence car, or a single rare object far from the others, and raise its saliency instead of letting it be dropped.

Both modules add very little: about 0.6 million learnable parameters for the super-resolution step and about 0.125 million for the scene graph. They are not tied to one dataset and can be added to any query-based detector.

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/saliency-scores.jpg" alt="Four street scenes with yellow dots on candidate objects, each labeled with a saliency score between about 0.44 and 0.94, including a pedestrian crossing near a fence and cars partly behind a parked sedan." loading="lazy" />
  <figcaption>Saliency scores learned by the scene graph for a few candidate objects (yellow dots mark each object's center). The graph raises the scores of hidden and isolated objects while keeping clearly visible ones high. From the paper; camera images from nuScenes (CC BY-NC-SA 4.0).</figcaption>
</figure>

## What are the key findings?

- On Argoverse 2, Safer3D reached **26.7% mAP** with the standard VoVNet backbone, **2.3 points above Far3D**, the previous best camera method, and raised the official composite score (CDS) from 18.1% to 21.5%. It also placed and sized objects more accurately.
- With a larger ViT-L backbone, Safer3D reached **32.7% mAP**, above all three LiDAR detectors tested (best: VoxelNeXt, 30.7%), using cameras alone. LiDAR still locates objects more precisely, because it measures depth directly.
- Recall rose by **about 4%** over Far3D, with the largest gains in the **50–150 meter** band, the range that sets how early a car can react.
- Detection improved for every safety-critical class checked: **+3.2 AP points for pedestrians**, +2.7 for bicycles, +2.3 for construction barrels, +1.8 for motorcycles and +0.9 for cones. Wheelchairs and wheeled riders remain hard, because they are rare in the data and often heavily hidden.
- On nuScenes, a different dataset with different cameras, Safer3D again led the camera-based methods (52.8% mAP, 61.1% NDS), showing the gains carry over.
- Each module helps on its own, and together they add up: from 24.4% mAP for the baseline to 25.7% with the first two modules and 26.7% with all three.

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/argoverse2-map.png" alt="Horizontal bar chart of mAP on Argoverse 2. Camera methods StreamPETR 20.3, Far3D 24.4, Safer3D 26.7. LiDAR methods CenterPoint 27.4, FSD 29.1, VoxelNeXt 30.7. With a larger backbone, camera methods Far3D 31.6 and Safer3D 32.7." loading="lazy" />
  <figcaption>Detection accuracy (mAP) on Argoverse 2. Safer3D (dark blue) beats the other camera-only methods (grey) with the same backbone, and with a larger backbone it beats all three LiDAR detectors (gold). Chart drawn from Table 1 of the paper.</figcaption>
</figure>

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/vru-class-gains.png" alt="Dot plot of average precision for nine classes, Far3D in blue and Safer3D in orange. Safer3D is higher in every class, with gains from 0.9 for construction cones to 6.2 for wheelchairs." loading="lazy" />
  <figcaption>Detection accuracy for vulnerable road users and work-zone objects, Far3D (blue) versus Safer3D (orange). Safer3D is ahead in every class. From the paper.</figcaption>
</figure>

<figure>
  <img src="/media/biswas-safer3d-multiview-wacv-2027/recall-by-range.png" alt="Four line charts of recall and mAP against distance-matching thresholds, for the full 0 to 150 meter range and the far 50 to 150 meter range. The Safer3D line is highest in all four, with the widest gap in the far range." loading="lazy" />
  <figcaption>Recall (left two) and mAP (right two) over the full range (0–150 m) and the far range (50–150 m). Safer3D (blue) is on top in every panel, and the gap is widest far from the car. From the paper.</figcaption>
</figure>

## What can this be used for?

- **Safer automated driving on fast roads.** Detecting distant objects earlier stretches the car's planning horizon, giving the controller more time to slow down or change lanes.
- **Protecting pedestrians, cyclists and road workers.** Better detection of hidden people and of cones and barrels matters most in city streets and work zones.
- **Lower-cost perception.** A camera-only system that matches or beats LiDAR detectors on far-range accuracy is attractive for vehicles and fleets where LiDAR cost is a barrier.
- **Upgrading existing detectors.** The three modules are small and plug into any query-based multi-camera detector.

Next, we plan to extend this work to bad weather, where rain, fog and dirty lenses can blind camera-only systems.
