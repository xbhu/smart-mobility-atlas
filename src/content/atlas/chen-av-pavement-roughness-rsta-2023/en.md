---
tldr: >-
  We compared how automated and human-driven cars use the same stretch of freeway and fed the
  differences into a machine learning model trained on 1,707 real pavement records; with everything
  else equal, automated traffic made asphalt roughen 8.1% faster, and up to 28.5% faster on young
  pavements.
hero:
  image: /media/chen-av-pavement-roughness-rsta-2023/lane-position.png
  alt: Histogram of where vehicles drive across a 12-foot lane on the same freeway. Automated vehicles (blue) form a single tall spike, with about 75% of them at one position around 3.5 feet from the lane's left edge; human-driven vehicles (orange) spread out between about 1.5 and 8 feet, no position holding more than 10%
  caption: >-
    Same freeway, same traffic, two kinds of drivers. Automated vehicles (CAV, blue) put their wheels on almost exactly the
    same spot in the lane, while human drivers (HDV, orange) drift from side to side. For the pavement, that means one narrow
    strip of asphalt takes nearly every load.
  credit: From the paper
affiliations:
  - The Pennsylvania State University
  - Missouri University of Science and Technology
author_affiliations: [[1], [1], [2], [1], [2]]
abstract: |-
  Studies have been initiated to investigate the potential impact of Connected and Automated Vehicles (CAVs) on transportation infrastructure to support future CAV testing and deployment. However, most existing research only focuses on the different wandering patterns of CAV. To bridge this gap, an apple-to-apple comparison is first performed to systematically reveal the behavioral differences between the human-driven vehicle (HDV) and CAV trajectory patterns for the first time, with the data collected from camera-based Next Generation Simulation (NGSIM) dataset and autonomous driving co-simulation platform, CARLA and SUMO, respectively. A gradient boosting-based ensemble learning model for pavement performance (i.e., International Roughness Index, IRI) prediction is then developed with the input features including three driving pattern features, namely, lateral wandering deviation, longitudinal car-following distance, and driving speed, plus other twenty context variables. A total of 1,707 observations is extracted from the Long-Term Pavement Performance (LTPP) database for model training purposes. The result indicates that the trained model can accurately predict pavement deterioration, and that CAV deteriorates pavement faster than HDV by 8.1% on average. The results of sensitivity analysis show that CAV deployment will create a greater impact on the younger pavements, and the rate of pavement deterioration is found to be stable under light traffic, whereas it will increase under congested traffic.
key_numbers:
  - { value: "8.1%", label: "faster growth in pavement roughness under automated traffic than under human drivers" }
  - { value: "0.46 vs 1.21 ft", label: "spread of lane position, automated vs. human-driven vehicles" }
  - { value: "28.5%", label: "faster roughening on pavements up to 4 years old" }
  - { value: "1,707", label: "pavement records from 246 LTPP test sections used to train the model" }
updated: 2026-10-27
---

## What problem does this research solve?

Large-scale deployment of connected and automated vehicles (CAVs) may still be ten or fifteen years away. But pavements and bridges last for decades, so the roads being built and resurfaced today will carry that traffic. Agencies that design and maintain pavements need to know now whether automated traffic will wear roads out faster or slower.

Automated vehicles drive differently from people. Lane-keeping and lane-centering systems put the car in the middle of the lane almost every time, while human drivers drift from side to side. Earlier studies showed that this **channelized** traffic concentrates wheel loads on a narrow strip and can speed up rutting and cracking. But those studies looked only at lane position, and most simply assumed automated vehicles never deviate from the center line at all. That is unrealistic and can make pavement designs needlessly thick and costly.

Lane position is also not the only difference. Automated vehicles can follow each other more closely and hold steadier speeds. Shorter gaps give the asphalt less time to recover between loads, and speed changes how a load stresses the pavement. Nobody had compared all three behaviors side by side and measured what they do to the road.

## What did we do?

We needed an **apple-to-apple comparison**: human and automated vehicles driving the same road, with the same lanes and the same traffic.

For human drivers, we used the Federal Highway Administration's NGSIM data from eastbound I-80 in Emeryville, California. Cameras on top of a 30-story building recorded every vehicle on a 500-meter, six-lane section of freeway ten times a second. After removing vehicles that entered, exited or changed lanes, 601 vehicle trajectories remained from a congested afternoon in April 2005.

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/ngsim-i80-site.jpg" alt="Left, a video camera mounted on a rooftop pointing down at a busy multi-lane freeway along the bay. Right, an aerial map of the I-80 study area in Emeryville, marking seven camera coverage zones along a 503-meter stretch between the Powell Street on-ramp and the Ashby Avenue off-ramp" loading="lazy" />
  <figcaption>Where the human driving data comes from. Left: one of the NGSIM cameras on the rooftop above I-80. Right: the 503-meter study area covered by seven cameras. Image: FHWA NGSIM program, from the paper.</figcaption>
</figure>

For automated vehicles, we rebuilt the same stretch of I-80 from OpenStreetMap in a co-simulation that couples **CARLA**, an open-source driving simulator, with **SUMO**, a traffic simulator. Every vehicle ran with autopilot, lane centering and adaptive cruise control, and the number of lanes, lane width and traffic volume were set to match the NGSIM data.

<figure class="figure-row">
  <img src="/media/chen-av-pavement-roughness-rsta-2023/ngsim-trajectories.png" alt="Plot of hundreds of human-driven vehicle paths across six lanes, each lane separated by a dashed blue line; within each lane the paths wiggle from side to side" loading="lazy" />
  <img src="/media/chen-av-pavement-roughness-rsta-2023/carla-sumo-cosim.jpg" alt="Screenshot of the CARLA simulator: a top-down view of simulated vehicles on the freeway, with camera views from the simulated cars on the left" loading="lazy" />
  <figcaption>Left: the 601 human-driven paths on the six-lane I-80 section, which wander within each lane. Right: the CARLA–SUMO co-simulation that produced the automated traffic on a digital copy of the same freeway. Images: from the paper.</figcaption>
</figure>

The two data sets revealed three clear differences:

- **Lane position.** More than 70% of automated vehicles stayed within 0.3 feet of the same spot in the lane. The standard deviation of lane position was **0.46 ft for automated vehicles versus 1.21 ft for human drivers**.
- **Following distance.** Automated vehicles kept an average gap of **31.5 ft** with very little variation; human drivers averaged **66.4 ft**, spread anywhere from 0 to 150 ft.
- **Speed.** In this very congested traffic, automated vehicles averaged **14.4 mph** and human drivers **18.4 mph**, with automated speeds much more uniform.

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/driving-patterns.png" alt="Three histograms comparing automated vehicles (blue) and human-driven vehicles (orange). Left, lateral position in the lane: automated vehicles form one tall spike, human drivers spread from about 1.5 to 8 feet. Middle, gap to the vehicle ahead: automated vehicles cluster at 25 to 50 feet, human drivers spread out to 150 feet. Right, speed: both mostly between 10 and 20 mph, automated vehicles more tightly grouped" loading="lazy" />
  <figcaption>All three differences side by side: lane position, gap to the vehicle ahead and speed, automated (blue) vs. human-driven (orange). On each measure, automated driving is far more uniform. Image: from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The simulation tells us how automated vehicles drive, but not what happens to the pavement, because a simulated road never wears out. So we turned to the **Long-Term Pavement Performance (LTPP)** program, which records the condition of real pavement test sections across the U.S. over many years. We used **1,707 observations from 246 asphalt sections** covering all four climate zones (dry/wet, freeze/no-freeze).

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/methodology-flow.png" alt="Flow chart with three boxes. 1, driving pattern comparison: CAV from CARLA and SUMO co-simulation, HDV from NGSIM. 2, prediction model training: a ThunderGBM ensemble model with context and driving pattern features from LTPP, output IRI. 3, pavement performance evaluation: the trained model is run with CAV and then HDV driving features to predict IRI" loading="lazy" />
  <figcaption>The three steps. Compare how the two kinds of vehicles drive (1), teach a model how driving behavior and site conditions shape pavement roughness using real LTPP data (2), then ask the model what happens to the same roads under each driving style (3). Image: from the paper.</figcaption>
</figure>

The model predicts the **International Roughness Index (IRI)**, the standard measure of how bumpy a road is to drive on, in meters per kilometer (higher is rougher). It builds on our earlier explainable pavement model (Song et al., 2022) and uses **gradient boosting** (the GPU-based ThunderGBM), which combines many small decision trees, each correcting the errors of the ones before it. It takes 23 inputs:

- **3 driving-behavior features**: lane position spread, following distance and speed. LTPP does not record these directly, so we estimated them for each section from its lane and shoulder widths and its traffic counts, using a published wander model, the standard BPR speed–volume function and basic traffic flow theory.
- **20 context features** describing each section's existing distresses (cracking, rutting, patching, friction), layer thickness and stiffness, drainage, climate, truck loading and age.

Trained on 80% of the records and tested on the other 20%, the model explained **88.7% of the variation** in roughness on sections it had never seen (R² = 0.887). That beat the design-guide (MEPDG) equation, linear regression, a neural network and a random forest, and adding the three driving features improved on the same model without them.

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/model-benchmark.png" alt="Bar chart of test-set R squared: MEPDG 0.560, multivariate linear regression 0.577, artificial neural network 0.792, random forest 0.862, gradient boosting with 20 context features 0.881, gradient boosting with 3 added driving features 0.887" loading="lazy" />
  <figcaption>Prediction accuracy on test sections the models never saw. The proposed model (dark bar) is the most accurate, and the three driving features add accuracy on top of the context features alone. Chart drawn from the numbers in the paper.</figcaption>
</figure>

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/model-residuals.png" alt="Residual plot of predicted IRI against prediction error. Blue training points sit on the zero line; green test points scatter mostly within plus or minus 0.2 m/km, evenly above and below zero" loading="lazy" />
  <figcaption>Prediction errors for training sections (blue) and test sections (green). Test errors fall evenly above and below zero, so the model neither systematically overestimates nor underestimates roughness. Image: from the paper.</figcaption>
</figure>

## What are the key findings?

We then ran every one of the 1,707 records through the model twice, keeping the 20 context features exactly as measured and switching only the three driving features between human and automated values. Any difference in the result comes from driving behavior alone.

- **Automated traffic roughens pavement 8.1% faster.** Starting from the same average IRI of 0.839 m/km, roughness grew by 0.1329 m/km (15.8%) under human drivers and by 0.1436 m/km (17.1%) under automated vehicles, an 8.1% larger increase.
- **New pavements feel it most.** On pavements up to 4 years old, roughness grew **28.5% faster** under automated traffic. The extra wear was 6.9% at 4–8 years, 9.1% at 8–12 years, 4.2% at 12–16 years and 6.4% beyond 16 years.

<figure>
  <img src="/media/chen-av-pavement-roughness-rsta-2023/impact-by-age.png" alt="Bar chart of increase in IRI by pavement age group, with paired blue (CAV) and orange (HDV) bars, and a blue line for the relative CAV impact that is highest for the youngest group and drops sharply after it" loading="lazy" />
  <figcaption>Roughness increase by pavement age, automated (blue bars) vs. human-driven (orange bars). Automated traffic adds more wear in every age group; the line shows that the relative penalty is largest on the newest pavements. Image: from the paper.</figcaption>
</figure>

- **Heavy truck traffic is the tipping point.** Under automated traffic, roughness growth stayed steady at about 0.13 m/km while peak-hour truck volume was below 90 trucks per hour, then climbed from 0.134 to 0.197 m/km as trucks rose to 150 per hour.
- **The early years of deployment matter most.** In mixed traffic, the average roughness increase jumped from 0.08 m/km at 20% automated vehicles to 0.13 m/km at 40%, then leveled off at about 0.14 m/km once automated vehicles made up half the fleet or more.

<figure class="figure-row">
  <img src="/media/chen-av-pavement-roughness-rsta-2023/truck-volume.png" alt="Box plots of increase in IRI for five peak-hour truck volume groups from 0 to 150 vehicles per hour; the medians are flat for the first three groups and rise for 90 to 150" loading="lazy" />
  <img src="/media/chen-av-pavement-roughness-rsta-2023/penetration-rate.png" alt="Bar chart of increased mean IRI by CAV penetration rate: about 0.085 at 20%, about 0.13 at 40%, and about 0.14 from 60% to 100%" loading="lazy" />
  <figcaption>Left: under automated traffic, roughness growth is flat at low truck volumes and rises above 90 trucks per hour. Right: as the share of automated vehicles grows from 20% to 100%, most of the extra wear arrives by the time they reach 40% to 50%. Images: from the paper.</figcaption>
</figure>

## What can this be used for?

- **Pavement design.** Automated traffic does wear pavement faster, but the effect comes from measurable behavior, not the "zero wander" worst case. Designers can use realistic lane-position, spacing and speed values rather than overly conservative assumptions that inflate costs.
- **Maintenance planning.** Agencies can expect more frequent maintenance on new pavements and on heavy-truck corridors as automated vehicles appear, and should plan for the change early, because most of the effect arrives at low market shares.
- **Pavement management.** The results help agencies decide what pavement and traffic data to collect, analyze and report so that their pavement management systems can account for automated traffic and find cost-effective maintenance strategies.

The automated traffic here was simulated, and the study covers asphalt pavements and three driving behaviors. Next steps include how automated vehicles spread across lanes, how sensor and control accuracy change as the technology matures, and the feedback loop in which rougher pavement in turn changes how automated vehicles drive and which routes they choose.

This research was supported by the U.S. Department of Transportation through the National Center for Transportation Infrastructure Durability and Life Extension (TriDurLE), under the project "Preparation of Pavement Infrastructure for Connected and Autonomous Vehicle Deployment – Phase I."
