---
tldr: >-
  We reviewed the three kinds of markers that roads and roadside infrastructure can give automated
  vehicles as fixed, machine-readable reference points (visual markers, magnets embedded in the road
  and wireless tags), compared what each does well and where each fails, and matched them to the
  driving scenarios where they help most.
hero:
  image: /media/wu-markers-review-iavvc-2025/av-markers-scene.jpg
  alt: Rendering of a white automated car approaching a signalized intersection; a square black-and-white fiducial marker hangs on the signal mast, small blue magnets are set into the road surface, and orange tags sit along the roadside
  caption: One intersection, three kinds of markers. A camera-readable fiducial marker hangs on the signal mast, magnets (blue) are set into the pavement, and wireless tags (orange) line the roadside. Each gives the car a fixed, known reference point that does not depend on GPS or on how well its own sensors see the scene.
  credit: Smart Mobility Lab, Penn State
affiliations:
  - The Pennsylvania State University
  - AstaZero
author_affiliations: [[1], [1], [2], [2], [1]]
abstract: |-
  Automated vehicles (AVs) heavily depend on sophisticated sensing technologies and advanced algorithms to accurately interpret their surroundings and make safe driving decisions. Despite significant advances in onboard sensors such as cameras, LiDAR, and radar, AV systems still encounter considerable challenges in complex real-world scenarios, including poor lighting, adverse weather conditions, occlusion, and densely populated urban environments. Consequently, external infrastructure solutions have emerged as vital components to enhance AV capabilities beyond onboard sensors alone. Markers, representing infrastructure-based technologies, offer distinct and stable reference points to assist vehicle perception, precise localization, accurate identification, and effective sensor calibration. This study systematically reviews three primary marker technologies: visual markers (e.g., QR codes, fiducial markers), magnetic markers embedded in road surfaces, and wireless tags (e.g., RFID, Bluetooth). For each marker type, we discuss operational principles, highlight key advantages, and analyze inherent limitations. Furthermore, we explore practical applications across various driving scenarios, from structured indoor facilities to challenging outdoor environments, while critically examining deployment challenges including infrastructure costs, environmental sensitivity, and signal interference. Finally, we outline several future research directions emphasizing multimodal marker integration, advanced sensor fusion techniques, and optimized deployment strategies, all aiming to further enhance the robustness and operational safety of automated vehicle systems.
key_numbers:
  - { value: "3", label: "marker families compared: visual markers, road-embedded magnets and wireless tags" }
  - { value: "mm-level", label: "positioning reported for magnetic marker systems, unaffected by light, rain, fog or dust" }
  - { value: "1–12 m", label: "read range of passive UHF RFID tags, which still work at high vehicle speeds" }
  - { value: "10–100 m", label: "range of Bluetooth Low Energy (BLE) tags, which also support two-way communication" }
updated: 2026-10-26
---

## What problem does this research solve?

<blockquote class="pull-quote">
  <p>An automated vehicle has to know, at every moment, exactly where it is and what is around it. It answers those questions with its own sensors: satellite positioning (GNSS) for its place on the map, and cameras, LiDAR and radar for its surroundings. <strong>These sensors have improved enormously, but they still struggle in exactly the places where mistakes matter most.</strong> GNSS signals fade in tunnels, parking garages and "urban canyons" between tall buildings. Cameras lose detail at night, in glare and in rain. Every sensor is blocked when a truck or a building stands in the way.</p>
</blockquote>

One way around this is to let the road help. **Markers** are small pieces of infrastructure that carry a known identity and sit at a known, surveyed location: a printed pattern on a sign, a magnet set into the pavement, a radio tag on a roadside post. When the vehicle detects one, it gets a fixed reference point that does not drift and does not depend on satellites, which it can use to correct its position, confirm what it is seeing, or check that its own sensors are aligned.

Researchers have studied each kind of marker, but mostly one at a time, often for indoor robots or drones rather than cars on public roads. A road agency or vehicle developer deciding which markers to install, and where, has had no side-by-side comparison of the options. This paper provides one.

## What did we do?

We reviewed the three main families of markers used, or proposed, for automated vehicles:

- **Visual markers**, read by cameras. Barcodes and QR codes store data in black-and-white patterns. **Fiducial markers** such as AprilTag and ArUco carry only a short ID, but are designed so a camera can work out its exact distance and angle to the marker from the marker's four corners.
- **Magnetic markers**, permanent magnets embedded under the road surface in lines along a lane or in grids at intersections. A row of magnetic sensors under the car detects the change in the magnetic field as it drives over them.
- **Wireless tags**, which talk to the car by radio and need no line of sight. Passive **RFID** tags have no battery and answer when a reader on the vehicle interrogates them. **Bluetooth Low Energy (BLE)** beacons are battery-powered, reach farther and can exchange data both ways.

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/marker-families.png" alt="Six example markers in three groups: visual markers (a barcode, a QR code and a square fiducial marker), a magnetic marker (a cylindrical road magnet), and wireless tags (a flat RFID tag and a round BLE beacon)" loading="lazy" />
  <figcaption>The three marker families compared in the review. Visual markers are cheap to print, magnets are buried in the road, and wireless tags are small radio devices that can sit in the pavement or on roadside structures. Image: Wu et al., IAVVC 2025 presentation.</figcaption>
</figure>

For each family we described how it works, where it is installed, which sensor the vehicle needs to read it, and its strengths and weaknesses. We then looked at how markers are used in three jobs (localization, identification and sensor calibration), what gets in the way of deploying them on real roads, and how researchers are tackling those obstacles.

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/deployment.png" alt="Three line drawings: a car's roof camera looking up at a fiducial marker; a car with a magnetic sensor bar under its front bumper passing over a buried magnet; a car seen from above surrounded by four wireless tags with dashed lines to a reader in the middle" loading="lazy" />
  <figcaption>What the vehicle needs to read each kind of marker: a camera with a clear view of the fiducial marker (left), a magnetic sensor array mounted low under the car (center), and an onboard radio reader that picks up nearby tags in any direction (right). Image: Wu et al., IAVVC 2025 presentation.</figcaption>
</figure>

The paper's first comparison table puts the six marker technologies side by side:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Technology</th><th scope="col">Detection range</th><th scope="col">Data it can carry</th><th scope="col">Main advantage</th><th scope="col">Cost</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Barcode<span>visual</span></th><td>0.1–0.5 m</td><td>8–20 characters</td><td>Simple, cost-effective, reliable</td><td>Very low</td></tr>
        <tr><th scope="row">QR code<span>visual</span></th><td>0.1–3 m</td><td>4 KB</td><td>High capacity, error correction</td><td>Very low</td></tr>
        <tr><th scope="row">Fiducial marker<span>visual</span></th><td>0.1–10 m</td><td>ID only</td><td>High-accuracy positioning</td><td>Very low</td></tr>
        <tr><th scope="row">Magnetic marker<span>magnetic</span></th><td>Contact to 0.3 m</td><td>None</td><td>Reliable in any weather or light</td><td>Low</td></tr>
        <tr><th scope="row">RFID tag<span>wireless</span></th><td>1–12 m (passive)</td><td>128 B–8 KB</td><td>No line of sight needed; many tags read at once</td><td>Medium</td></tr>
        <tr><th scope="row">BLE tag<span>wireless</span></th><td>10–100 m</td><td>255 B per packet</td><td>Long range, two-way communication</td><td>High</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Comparison of marker technologies, from Table I of the paper. The trade-off is plain: the cheapest markers must be seen up close, while the ones that work at range and out of sight cost more.</figcaption>
</figure>

This review is part of **CyberMAP** (Cyber-physical Multi-factor Authentication based Positioning for Autonomous Vehicles), a collaboration between Penn State and AstaZero, the Swedish proving ground for automated vehicles, funded by Vinnova, Sweden's innovation agency.

## What is the key methodological contribution?

The review does not stop at listing technologies. It explains, for each marker family, **how a car turns a detection into a position**, and what limits the accuracy.

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/fiducial-designs.png" alt="Six fiducial marker designs in a row: ARToolKit, ARTag, AprilTag and ArUco are square black-and-white patterns, STag is a square with a circular pattern inside, and RuneTag is a ring of black dots" loading="lazy" />
  <figcaption>Fiducial markers come in many designs. Square ones are simple and fast to detect; circular ones such as RuneTag hold up better when part of the marker is hidden, at the cost of slower detection. Image: Wu et al., IAVVC 2025 presentation.</figcaption>
</figure>

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/localization-principles.png" alt="Three diagrams: a camera's image plane and a square marker with coordinate frames, showing how the marker's pose is computed; the looping magnetic field lines around a coil and a sensor nearby; circles drawn around three beacons whose intersection gives the receiver's location" loading="lazy" />
  <figcaption>How each marker family localizes a vehicle. Left: a camera matches the marker's corners in the image to their known 3D positions and solves for its own pose (the Perspective-n-Point method). Center: a magnetic sensor detects the field of a buried magnet when it passes close by. Right: a radio receiver estimates its distance or direction to several fixed tags and intersects them. Image: Wu et al., IAVVC 2025 presentation.</figcaption>
</figure>

- **Visual markers** can reach sub-centimeter accuracy in controlled settings such as parking lots and warehouses. A single camera can confuse two orientations of a square marker that look almost alike in the image; a stereo camera pair resolves this by cross-checking two views.
- **Magnetic markers** give highly repeatable fixes. Systems such as the Global Magnetic Positioning System (GMPS), used on automated buses, combine sensor readings with odometry in an extended Kalman filter and report millimeter-level accuracy, even on tight curves. Two sensor arrays, front and rear, give the vehicle's heading as well as its position.
- **Wireless tags** give an absolute position each time a tag is read, and the car "dead-reckons" from its wheel and inertial sensors in between. RFID reaches sub-meter accuracy in controlled conditions and works at high speed; BLE covers more ground with fewer beacons but is noisier and slower.

In every case the marker is a **correction, not a replacement**: the car keeps driving on its own sensors and uses each marker detection to remove the drift that builds up between detections.

## What are the key findings?

**No single marker wins everywhere.** Visual markers are the cheapest and the most precise, but they need a clear line of sight and good lighting. Magnets work in fog, snow and darkness and in tunnels where GNSS fails, but they must be cut into the pavement, maintained, and placed densely enough, especially on curves and at intersections. Wireless tags need no line of sight and can carry rich, changing information, but they face radio interference, signal reflections off metal, battery replacement for BLE, and cybersecurity risks such as spoofed signals.

The paper matches each marker to the scenarios where it fits best:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Scenario</th><th scope="col">Example</th><th scope="col">Recommended markers</th><th scope="col">Why</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Poor visibility or bad weather</th><td>Outdoor roads in harsh weather</td><td>Magnetic markers</td><td>Reliable detection in all environmental conditions</td></tr>
        <tr><th scope="row">Low speed, high precision</th><td>Parking lot navigation</td><td>Fiducial markers, magnetic markers</td><td>High positional accuracy for tasks like precision docking</td></tr>
        <tr><th scope="row">Long range, high speed</th><td>Tunnel and bridge localization</td><td>RFID tags, magnetic markers</td><td>Quick and robust detection</td></tr>
        <tr><th scope="row">Long-distance communication</th><td>Remote object tracking</td><td>BLE tags</td><td>Extended range and two-way communication</td></tr>
        <tr><th scope="row">Complex urban environments</th><td>Work zones, intersections, urban streets</td><td>RFID tags, BLE tags</td><td>Work without line of sight and support dynamic updates</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Which marker for which scenario, from Table II of the paper.</figcaption>
</figure>

Markers do more than localize. A QR code printed on a sign can tell the car the speed limit or announce a temporary construction zone; tags on emergency vehicles or work-zone equipment can broadcast their presence so automated vehicles yield or reroute early; beacons at a smart intersection can relay signal phase and timing so the car anticipates a red light. Markers with precisely known geometry, such as checkerboards, AprilTags and LiDAR-readable targets, are also widely used for **calibrating** a vehicle's cameras and LiDAR against each other.

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/carla-marker-signal.jpg" alt="Simulated city intersection seen from just above a car's hood, with a black-and-white fiducial marker mounted between two traffic signals over the road" loading="lazy" />
  <figcaption>A fiducial marker mounted with the traffic signals, as the car's camera sees it in the CARLA driving simulator. In a dense city, where buildings, vehicles and pedestrians hide parts of the scene, a data-embedded marker like this can hand the car critical information about the intersection from its own point of view. Image: Smart Mobility Lab, Penn State.</figcaption>
</figure>

## What can this be used for?

For **transportation agencies**, the review is a starting point for deciding which markers to install where: magnets for weather-proof positioning on outdoor roads, snow-covered roads and in tunnels, RFID on bridges and in tunnels where GNSS drops out, fiducial markers in parking facilities and at intersections, and wireless tags in work zones where information changes from day to day.

For **researchers**, the paper lays out four directions:

1. **Fuse markers with more sensors.** Today markers are mostly used to correct odometry drift. Combining them with visual SLAM, LiDAR, radar and inertial sensors, through factor graphs or pose-graph optimization, would keep localization reliable when one sensor degrades.
2. **Better real-time algorithms.** Most systems rely on the extended Kalman filter. Unscented Kalman filters, non-parametric Bayesian filters, and hybrids of learning-based and model-based methods can handle more nonlinear, dynamic situations.
3. **Optimize where markers go.** Uniform or rule-of-thumb placement wastes markers in some places and leaves gaps in others. Traffic, road geometry and environment data, together with optimization (mixed-integer programming, genetic algorithms, reinforcement learning) and digital-twin simulation, can guide density and placement.
4. **Combine marker types.** Each family covers the others' weak spots: visual markers for precision, magnets for robustness when cameras fail, wireless tags for semantic data and range. Multimodal markers already point the way, and common standards for encoding and communication will be needed for broad deployment.

<figure>
  <img src="/media/wu-markers-review-iavvc-2025/multimodal-marker.png" alt="The same square marker seen three ways: a photograph of a black plate with a white bar and reflective border; a sparse LiDAR point cloud outlining the square; a thermal image in which the bar and border glow" loading="lazy" />
  <figcaption>A multimodal marker (ArTuga) seen by three different sensors: a regular camera, a LiDAR and a thermal camera. Markers like this stay detectable when one sensor is blinded by darkness or bad weather. Images: ArTuga, Claro et al. (2023), reference 12 of the paper.</figcaption>
</figure>
