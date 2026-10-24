---
tldr: >-
  We built a field-test protocol and a three-layer statistical framework for the driverless work-zone
  follow truck (ATMA), and Missouri DOT tests showed it tracks the lead truck within ±6 inches in most
  maneuvers and stops within 1.9 seconds when both radios fail.
hero:
  video: /media/av-atma-field-testing-trr-2021/live-demo-loop.mp4
  poster: /media/av-atma-field-testing-trr-2021/live-demo-loop-poster.jpg
  loop: true
  alt: Drone view of a driverless follow truck shadowing a striping truck down a suburban road, with an inset of its empty cab
  caption: An ATMA follow truck with no one in the cab (inset) shadows a striping truck during a live demonstration.
  credit: Royal Truck & Equipment
affiliations:
  - Missouri University of Science and Technology
  - Chang'an University
  - Stony Brook University
author_affiliations: [[1], [2, 1], [1], [1], [1], [3]]
abstract: |-
  Mobile and slow-moving operations, such as striping, sweeping, bridge flushing, and pothole patching, are critical for efficient and safe operation of a highway transportation system. However, reducing hazards for roadway workers and achieving a safer environment for both roadway maintenance operators and the public have been a challenging problem. In 2017 alone, a total of 158,000 total crashes occurred in our nation's work zones, accounting for 61,000 injuries. The Autonomous Truck Mounted Attenuator (ATMA) vehicle, sometimes referred to as an Autonomous Impact Protection Vehicle (AIPV), offers a promising solution to eliminate injuries to Department of Transportation (DOT) employees.

  This manuscript presents the evaluation methodology for the ATMA system, as well as the field-testing outcomes in Sedalia, MO. To the best of our knowledge, our manuscript is the first academic research that focused on ATMA. The ATMA system was first reviewed, and then followed by an introduction to field-testing procedures that included descriptions of test cases and data collected, and their format. Analysis methodology was then proposed to quantitatively evaluate the system's performance, and statistical models and hypothesis testing procedures were developed and presented. The numeric analysis results, from real-world field-testing under a controlled environment, were presented, and the ATMA system's performance was summarized. This manuscript can serve as a reference for transportation agencies that are interested in deploying similar technologies or by academic researchers to assess characteristics of autonomous vehicles and to apply knowledge gained in transportation modeling and simulation practices.
key_numbers:
  - { value: "31", label: "test scenarios, each repeated three times" }
  - { value: "±6 in", label: "lateral accuracy in most maneuvers, the MoDOT criterion" }
  - { value: "1.9 s", label: "to a full stop when both V2V radios fail" }
  - { value: "45 s", label: "of ±6 in tracking without GPS before a controlled stop" }
featured: true
updated: 2026-10-24
---

## What problem does this research solve?

Highway maintenance workers face serious risks every day. Operations like road striping, pothole patching, and bridge flushing require slow-moving trucks on high-speed roads. In 2017 alone, 158,000 crashes occurred in U.S. work zones, causing 61,000 injuries—many involving DOT employees.

<figure class="figure-row">
  <img src="/media/av-atma-field-testing-trr-2021/road-painting.jpg" alt="A slow-moving road painting truck applying a center line on a two-lane highway" loading="lazy" />
  <img src="/media/av-atma-field-testing-trr-2021/tma-crash-2017.jpg" alt="A pickup truck with a crushed front end next to an orange Missouri DOT truck after a rear-end crash" loading="lazy" />
  <figcaption>Left: a mobile striping operation. Right: a Missouri DOT truck mounted attenuator struck from behind by another vehicle in January 2017.</figcaption>
</figure>

<blockquote class="pull-quote">
  <p>“We were patching potholes on US-50 and I was following the pothole patcher. I noticed a truck coming close to me so I hit my panic lights to try and get him to get over in the passing lane. He did not and he hit the TMA I was in. Pushed me over 100 feet. We were both taken to the hospital. I couldn’t pick up my kids, couldn’t play with them, all because of someone’s negligence. This is serious. This is our lives in danger.”</p>
  <footer>Michael Suber, Missouri DOT maintenance worker, on the January 2017 crash</footer>
</blockquote>

The **Autonomous Truck Mounted Attenuator (ATMA)** system is designed to eliminate this risk. It operates as a **Leader-Follower Cooperative Driving Automation (CDA)** system: a human-driven Lead Truck (LT) performs the maintenance work, while a driverless Follow Truck (FT) autonomously tracks the LT's position, speed, and heading via V2V communication. The FT carries a Truck Mounted Attenuator (TMA) on its rear—if a rear-end crash is inevitable, the TMA absorbs the impact, and no DOT employee is harmed. The system operates within a tightly defined environment (low-speed mobile operations on closed or controlled lanes), making it one of the most practical near-term applications of autonomous vehicle technology in transportation.

<figure>
  <img src="/media/av-atma-field-testing-trr-2021/leader-follower-system.jpg" alt="A driverless follow truck carrying a crash attenuator next to a lead work truck, with a wireless signal drawn between them" loading="lazy" />
  <figcaption>The leader-follower system: the driverless follow truck with its attenuator (left, “unmanned ATMA”) and the human-driven lead truck (right), linked by vehicle-to-vehicle communication. Image: Royal Truck &amp; Equipment.</figcaption>
</figure>

By 2019, several state DOTs—including Colorado and Missouri—had already begun purchasing and deploying ATMA vehicles. But a critical question remained unanswered: **how well does the system actually perform under real-world conditions, and how do we measure that rigorously?** No academic evaluation framework existed. This paper fills that gap.

## What did we do?

The ATMA system gives operators control over key parameters—such as the gap distance between the LT and FT, and operating speed. But setting a parameter is not the same as achieving it. A gap of 100 feet may be maintained easily on a straight road at 10 mph—but what happens on a curve? During a lane change? When the LT brakes suddenly? When GPS signal is lost?

These are exactly the questions DOTs need answered before committing to full deployment.

We designed a field testing program with Missouri DOT in 2019, conducted at Fort Walton Beach, FL and Sedalia, MO. The program covered 31 test scenarios across four categories:

- **Communication loss**: radio failure, single and dual V2V channel loss, sensor disconnection, GPS-denied environment
- **Following accuracy**: straight roads, curves, lane changes, roundabouts, bump obstacles, U-turns
- **Obstacle detection**: front and side collision avoidance
- **Emergency situations**: emergency stops, human takeover, simulated rear impact, temporary vehicle drop and catch-up

<figure class="figure-row">
  <img src="/media/av-atma-field-testing-trr-2021/modot-lead-truck.jpg" alt="An orange Missouri DOT lead truck fitted with GPS antennas and sensors" loading="lazy" />
  <img src="/media/av-atma-field-testing-trr-2021/modot-follow-truck.jpg" alt="The back of a Missouri DOT follow truck carrying a Scorpion II truck mounted attenuator, with crew members nearby" loading="lazy" />
  <figcaption>The Missouri DOT trucks used in the field tests: the lead truck (left) and the follow truck with its attenuator (right).</figcaption>
</figure>

<figure>
  <img src="/media/av-atma-field-testing-trr-2021/test-design.png" alt="Diagram: 31 tests split into results that can be observed directly, such as emergency stops, and results that need statistics, such as lane accuracy measured by cross track error" loading="lazy" />
  <figcaption>How the 31 tests were judged. Some results can be observed directly; lateral accuracy is judged from the cross track error statistics.</figcaption>
</figure>

Each quantifiable test was repeated three times to support statistical analysis. We then developed an evaluation framework to convert raw sensor log data into defensible, quantified performance conclusions.

## What is the key methodological contribution?

Standard AV evaluation approaches were not designed for the small-sample, repeated-test structure of real-world field testing. We developed a **three-layer evaluation framework** built around the Cross Track Error (CTE)—the lateral deviation of the FT from the LT's intended path:

1. **Statistical characteristics**: Mean, standard deviation, and quantiles of CTE for each test, benchmarked against MoDOT's predefined performance criteria (±6 inches lateral tolerance).
2. **Probability distribution analysis**: What fraction of observations fall within the acceptable tolerance? This translates raw data into a nuanced pass/fail answer—not just whether the system passed, but by how much margin.
3. **Friedman nonparametric hypothesis testing**: Verifies that repeated runs of the same test produce statistically consistent results. This confirms system *stability*, not just one-time performance on a good day.

The Friedman test was specifically chosen because field test data is non-normally distributed and sample sizes are modest—conditions where standard parametric tests are inappropriate.

## What are the key findings?

- Under most operating conditions, the FT maintained lateral accuracy within **±6 inches** of the LT's path, meeting MoDOT's performance requirements.
- When both V2V radios failed simultaneously, the FT came to a complete stop within **1.9 seconds**—a critical safety result.
- In GPS-denied conditions, the Dead Reckoning Assembly maintained accuracy within **±6 inches for 45 seconds** before initiating a controlled stop—exactly as required.
- Hypothesis testing confirmed **statistically consistent performance across all repeated trials**, indicating the system is stable and repeatable under controlled conditions.
- Tight maneuvers—roundabouts and U-turns—showed higher CTE, with some observations reaching **±10 inches**. This is an important operational boundary for deployment planning: agencies should factor turning geometry into their route design.

<figure>
  <img src="/media/av-atma-field-testing-trr-2021/roundabout-cte.png" alt="Histogram of cross track error in inches for three repeated roundabout runs; the three distributions overlap closely" loading="lazy" />
  <figcaption>Cross track error in three repeated roundabout runs. The runs agree closely, which is what the hypothesis tests confirm, but the tails reach about ±10 inches.</figcaption>
</figure>

## What can this be used for?

- **DOTs evaluating ATMA procurement**: This paper provides a ready-made testing protocol and performance benchmarks you can reference or adapt for your own evaluation program.
- **DOTs already operating ATMA**: The statistical framework can be used for ongoing performance monitoring and to detect system degradation over time.
- **Researchers studying AV field evaluation**: The methodology applies to any leader-follower or CDA system operating within a constrained, well-defined operational design domain (ODD).

<figure>
  <img src="/media/av-atma-field-testing-trr-2021/pooled-fund-states.png" alt="Map of the United States with the participating states highlighted in blue, including Pennsylvania, Colorado, Minnesota, Texas and California" loading="lazy" />
  <figcaption>States taking part in the TPF-5(380) Autonomous Maintenance Technology pooled fund, which supports ATMA testing and deployment.</figcaption>
</figure>

<figure>
  <div class="media-frame"><video src="/media/av-atma-field-testing-trr-2021/live-demo.mp4" poster="/media/av-atma-field-testing-trr-2021/live-demo-poster.jpg" controls playsinline preload="none" aria-label="ATMA live demonstration of a striping operation"></video></div>
  <figcaption>Watch the full live demonstration of a striping operation with an ATMA follow truck (52 seconds, with sound). Video: Royal Truck &amp; Equipment.</figcaption>
</figure>
