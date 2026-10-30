---
tldr: >-
  We built a lightweight way for a driverless follower vehicle to know exactly where it is when GPS
  drops out, by matching what its LiDAR sees now against what the leader vehicle saw a moment earlier.
  In simulated city, rural, highway and mixed driving, it located both vehicles in 179.9 milliseconds
  per frame, fast enough for real time, with only a light computer on the follower.
hero:
  image: /media/ding-lidar-cooperative-localization-tits-2026/carla-leader-follower.jpg
  alt: Overhead view of a simulated city intersection. Two small blue cars are circled; the one ahead is labeled leader vehicle, human driver, main computer, and the one behind is labeled follower vehicle, driverless, light computer.
  caption: A leader-follower pair in our CARLA driving simulation. The follower drives the same road a few seconds behind the leader, so its sensor sees almost the same buildings, trees and curbs the leader just saw. This paper turns that overlap into a positioning signal that works without GPS.
  credit: Smart Mobility Lab, CARLA simulation
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1], [1], [1]]
abstract: |-
  The Leader-Follower Cooperative Driving Automation (LF-CDA) system, crucial for applications such as truck platooning and off-road vehicle convoys, relies on automation and communication technologies to virtually link multiple vehicles and has become a core focus in the automated vehicle industry. Accurate relative positioning is critical for LF-CDA operations, yet GNSS can be unreliable in challenging environments. Asymmetric architecture is common in many LF-CDA systems, making direct application of localization models either infeasible or both computationally and communication intensive. This manuscript presents a lightweight LiDAR-based cooperative localization model that leverages the unique characteristics of asymmetric LF-CDA systems, specifically the property of "asynchronous view repetition." In this context, the follower vehicle, operating in vehicle-following mode, consistently receives similar visual and spatial information as the leader vehicle, though with a time delay. To capitalize on such system characteristics, an asynchronous view repetition-based graph optimization model is formulated to minimize the positional errors of both leader and follower vehicles. To provide input to and solve the graph optimization model, a lightweight cooperative localization framework with multiple submodules is established, allowing the system to function independently of environmental constraints. A comprehensive set of experiments was conducted in the CARLA simulation environment, using CT-ICP and KISS-ICP as benchmarks, given their strong performance in single-vehicle settings. The results indicate that, under the LF-CDA scenario, our proposed model demonstrates greater suitability by achieving higher localization accuracy while maintaining comparable or even superior computational efficiency.
key_numbers:
  - { value: "179.9 ms", label: "to locate both vehicles per LiDAR frame, inside the 200 ms real-time budget" }
  - { value: "½", label: "the data the follower sends each frame (about 700 KB down to about 350 KB)" }
  - { value: "7%", label: "lower follower position error in the city from the view-repetition step" }
  - { value: "4", label: "simulated driving environments: city, rural, highway and mixed" }
updated: 2026-10-26
---

## What problem does this research solve?

In a **leader-follower** system, one vehicle with a human driver leads and one or more driverless vehicles follow it, copying its path. The idea is already in use or in testing on the road: **truck platoons**, where one driver can lead a line of automated trucks; **military convoys**, where unmanned cargo trucks follow a crewed lead vehicle through dangerous areas; and the **Autonomous Truck Mounted Attenuator (ATMA)**, where a driverless crash-cushion truck shadows a highway work crew so that no worker sits in the truck most likely to be hit (see our [ATMA field-testing page](/av-atma-field-testing-trr-2021/)).

<blockquote class="pull-quote">
  <p><strong>All of these depend on one thing: the follower must know, continuously and precisely, where it is and where the leader has been.</strong> Today that mostly comes from satellite positioning (GPS, or more generally GNSS). With several receivers and corrections, GNSS is accurate to about 4-7 inches. But it fails exactly where these vehicles work: along tree-lined roads, under bridges and overpasses, in tunnels, between tall buildings, and even on open rural interstates where the signal can come and go. <strong>In our Missouri DOT tests of the ATMA, the follow truck could keep its lane accuracy on its own motion sensors for only about 45 seconds after losing GPS, after which it is designed to stop.</strong></p>
</blockquote>

The obvious fix is to give the follower its own "self-driving brain" that tracks its position from its LiDAR (a laser scanner that maps its surroundings as a 3D cloud of points). But leader-follower systems are deliberately **asymmetric**: the leader carries the expensive computer and makes the decisions, while followers are kept simple and cheap. Standard LiDAR positioning methods are built for one fully equipped car, and running them for several vehicles either needs a powerful computer on every follower or a lot of data sent over the radio link between vehicles.

## What did we do?

We started from a simple observation about how these systems drive. The follower travels the same road as the leader, a short distance behind it. So whatever the follower's LiDAR sees right now (a house, a tree, a curb) is almost exactly what the leader's LiDAR saw a few seconds ago. We call this **asynchronous view repetition**: the same view, repeated with a time delay.

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/view-repetition.png" alt="Three-part diagram. (a) A photo-style image of a leader car ahead of a follower car on a highway, each with a sensor beam. (b) A row of green circles for the leader's positions over time and a yellow circle for the follower's current position; a red box groups the follower with the leader's earlier positions, and a blue box groups it with the leader's current position. A house and a tree sit between them. (c) A graph linking the follower's position A to the leader's past positions B, C, D and current position E." loading="lazy" />
  <figcaption>The idea in one picture. (a) The leader and follower drive the same road. (b) The follower now sees the house and tree the leader passed earlier (red box), and it keeps closing in on where the leader is now (blue box). (c) Both overlaps become links in a graph that ties the follower's position to the leader's recent path. From the paper.</figcaption>
</figure>

Instead of making the follower localize itself from scratch, we let the leader do the heavy lifting:

1. **Both vehicles slim down their LiDAR data.** Each scan is thinned on board, keeping one representative point per small cube of space, after using the motion sensor (IMU) to correct the blur caused by the vehicle moving during the scan. The scan keeps its shape but becomes much lighter to send and compare.
2. **The leader builds a running map.** As it drives, the leader works out its own position from its scans and stores its recent slimmed scans, each tagged with where it was taken, in a "feature map".
3. **The follower sends its slimmed scan to the leader** over the vehicle-to-vehicle radio link.
4. **The leader slots the follower's scan into its map.** Using a rough guess from the follower's motion sensor as a starting point, it finds the stretch of map where the leader passed nearby and lines the follower's scan up with it. That gives the follower's position.
5. **A final step corrects both vehicles at once** (described below), and a timing module makes sure the whole cycle finishes before the next LiDAR scan arrives.

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/framework.png" alt="Flow diagram. The follower vehicle's raw point clouds go through an IMU-assisted point cloud feature extraction module to become feature points. The leader vehicle's raw point clouds go through a robust feature map construction module to fill a feature map of past frames. Both feed a central red box, the asynchronous view repetition-based graph optimization module, with a feature-map based FV pose estimation module on the side and a decoupled real-time synchronization module across the top." loading="lazy" />
  <figcaption>How the pieces fit together. The follower (FV, left) only slims and sends its scans; the leader (LV, right) keeps the map, finds the follower's position and runs the correction step in the middle. From the paper.</figcaption>
</figure>

<figure class="figure-row">
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/leader-feature-map.jpg" alt="A dense white point cloud seen from above, showing two streets meeting at a corner, with trees and building edges." loading="lazy" />
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/follower-scan.jpg" alt="A single sparse LiDAR scan seen from above, with orange and red rings around the vehicle and the same street corner visible in yellow." loading="lazy" />
  <figcaption>Left: the map the leader has built from its recent scans. Right: one scan from the follower. The street corner appears in both, which is what lets the leader place the follower on its map. Images: Yuxin Ding, project presentation.</figcaption>
</figure>

We tested the system in the **CARLA** driving simulator, because public driving datasets either cover a single vehicle or, like V2V4Real, lack the motion-sensor data the method needs. The two vehicles drove routes through four CARLA towns standing for city, rural, highway and mixed driving, each carrying a simulated 32-beam LiDAR scanning 5 times per second and a motion sensor at 200 times per second. We compared against three leading single-vehicle LiDAR positioning methods (CT-ICP, KISS-ICP and Traj-LO) and against our own pipeline with the final correction step removed.

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/carla-test-towns.jpg" alt="Four overhead maps of simulated towns, each with a red route: (a) an urban area with tall buildings (Town10), (b) a rural area with fields and barns (Town07), (c) a highway area with long straight roads through trees (Town06), and (d) a hybrid area mixing a ring road, houses and city blocks (Town05). Black triangles mark the start and white triangles the destination." loading="lazy" />
  <figcaption>The four test routes in CARLA: city, rural, highway and mixed. Black triangles mark the start and white triangles the end. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The new piece is the correction step, an **asynchronous view repetition-based graph optimization**. Every position estimate drifts a little, and without GPS those small errors add up. The method writes the situation as a graph: dots for the leader's positions over the last several scans and for the follower's current position, and links for what we know about the distances and turns between them.

<figure class="figure-narrow">
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/loop-closure-graph.png" alt="Graph diagram. Green circles B, C, D and E mark the leader's positions from frame k minus j up to the current frame k, joined by green arrows. A yellow circle A marks the follower's current position, with a short black arrow to B and a long orange arrow to E; dashed lines link A to C and D." loading="lazy" />
  <figcaption>The loop that corrects the drift. Green: the leader's recent path, from where it was when it passed the follower's current spot (B) to where it is now (E). Black: the follower matched against that earlier leader position. Orange: the follower's direct position relative to the leader now. Together they close a loop, and any mismatch around it reveals accumulated error. From the paper.</figcaption>
</figure>

Two links do the work:

- a **look-back link** from the follower to the leader's position when it passed the same spot (B). That older leader position has had less time to drift, so it anchors the follower and pulls back the leader's own accumulated error.
- a **right-now link** from the follower to the leader's current position (E), which keeps the spacing between the two vehicles correct at this instant.

The method then adjusts all the positions together until the loop is as consistent as possible, giving the leader's older, more reliable positions more weight than its newest ones. It is solved with GTSAM, a standard robotics optimization library.

What makes this lightweight is where it looks. General-purpose multi-robot mapping searches the whole map history for places that might match, which is expensive. In a leader-follower system we already know where the match must be: just behind the leader, where the follower is now. Searching only there saves both computing time and radio bandwidth.

## What are the key findings?

- **Fast enough for real time.** With a LiDAR scanning 5 times per second, each cycle must finish in under 200 milliseconds. The full system located both vehicles in **179.9 ms** per frame. That is comparable to running the single-vehicle methods for both vehicles on the leader's computer (163.7 ms for KISS-ICP, 176.7 ms for CT-ICP), and faster than Traj-LO (226.8 ms), which would miss the deadline. Those methods also need the follower to stream its full raw scans to the leader.
- **Slimming the data is essential.** Thinning each scan cut the data sent from the follower from about 700 KB to about 350 KB per frame. Without that step, the same system took **321.3 ms** per frame and could not keep up.

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/runtime-per-frame.png" alt="Horizontal bar chart of processing time per frame for the leader and follower together. Ours, full model: 179.9 ms. KISS-ICP: 163.7 ms. CT-ICP: 176.7 ms. Traj-LO: 226.8 ms. Ours without data slimming: 321.3 ms. A dashed line marks the 200 ms budget; Traj-LO and ours without slimming cross it." loading="lazy" />
  <figcaption>Time to locate both vehicles for each LiDAR frame, in the city scenario. Everything left of the dashed line finishes before the next scan arrives. Chart drawn from Table IV of the paper.</figcaption>
</figure>

<figure class="figure-row">
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/raw-point-cloud.png" alt="A raw LiDAR scan on black: dense rings of white points around the vehicle and walls of points along the buildings." loading="lazy" />
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/feature-point-cloud.png" alt="The same scan after thinning: the rings and building walls are still clear but drawn with far fewer points." loading="lazy" />
  <figcaption>Left: a raw LiDAR scan. Right: the same scan after slimming. The streets and buildings are still recognizable, which is all the matching step needs. From the paper.</figcaption>
</figure>

- **The follower is located almost as well as the leader.** In all four environments, the full model gave the follower a lower position error than the same pipeline without the view-repetition step: about **7% lower in the city** and about 5% lower on the rural and highway routes. In the city, the follower's error (0.631) was within about 5% of the leader's (0.599). The paper notes that with the single-vehicle methods, followers consistently end up less accurate than leaders, and this approach narrows that gap.
- **The leader benefits too.** The correction step also reduced the leader's own error on every route. On the leader, our model had the lowest error (RMSE) of all methods in the city and rural tests; on the highway and mixed routes it was essentially tied with Traj-LO.
- **Feature-rich places are easiest.** Accuracy was best in the city, then rural and highway areas, and worst on the mixed route, whose sudden changes between road types make scans harder to match. More LiDAR points per scan improved accuracy, at a modest cost in time.

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/accuracy-by-scene.png" alt="Grouped bar chart of position error (RMSE) in four scenes. Urban: follower without the view-repetition step 0.68, follower with the full model 0.63, leader 0.60. Rural: 1.10, 1.04, 1.02. Highway: 1.17, 1.11, 1.07. Mixed: 3.13, 3.12, 2.03." loading="lazy" />
  <figcaption>Position error (root mean square of the absolute pose error; lower is better) for the follower without and with the view-repetition step, and for the leader. The follower gains on every route and in most scenes ends up close to the leader. The mixed route (called "hybrid" in the paper) is hardest. Chart drawn from Table III of the paper.</figcaption>
</figure>

<figure>
  <img src="/media/ding-lidar-cooperative-localization-tits-2026/trajectory-errors.jpg" alt="Eight 3D trajectory plots, a leader and a follower plot for each of four areas: urban (Town10), rural (Town07), highway (Town06) and hybrid. Each estimated path is colored from blue (small error) to red (large error) and drawn over a dashed reference path." loading="lazy" />
  <figcaption>Estimated paths for the leader and follower in each environment, colored by error from blue (small) to red (large), over the true path (dashed). The estimates closely follow the true path. From the paper.</figcaption>
</figure>

The results come from simulation with a stable radio link. The paper is clear about the limits: the method relies on the follower actually seeing what the leader saw, so it weakens with very long gaps between the vehicles, lane changes or blocked views, and on routes with little repeated scenery. For those cases it describes fallbacks, such as briefly relying on single-vehicle positioning or skipping a cycle when the radio is slow, and resuming the shared correction once the views overlap again. Testing on real vehicles is the next step.

## What can this be used for?

- **Work zone automation (ATMA).** A driverless follow truck behind a striping or patching crew often works along tree-lined roads and under overpasses, exactly where GPS drops out. This method could extend how long it can keep tracking the lead truck safely without GPS.
- **Truck platooning and convoys.** Followers can stay simple and inexpensive, with one capable computer on the lead vehicle, which is how these systems are designed to work.
- **Lighter radio links.** Sending slimmed scans rather than raw ones halves the data each follower transmits per frame, which matters as more followers join.
- **Researchers in cooperative driving.** The idea of exploiting a known, repeated viewpoint can be reused in other systems where vehicles follow the same path, and combined with cameras or radar in future work.
