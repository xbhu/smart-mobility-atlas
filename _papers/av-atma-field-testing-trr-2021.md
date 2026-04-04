---
layout: paper
title: "Evaluation Methodology of Leader-Follower Autonomous Vehicle 
        System for Work Zone Maintenance"
authors: "Qing Tang, Yanqiu Cheng, Xianbiao Hu, Chenxi Chen, 
          Yang Song, Ruwen Qin"
year: 2021
journal: "Transportation Research Record"
volume: "2675(5)"
pages: "107–119"
doi: "https://doi.org/10.1177/0361198120985233"
status: "Published"
category: "Automated Vehicles"
subcategory: "CDA for Work Zone"
code: "https://github.com/xbhu/AV-WorkZoneCDA-testing/tree/main"
ppt: "https://github.com/xbhu/AV-WorkZoneCDA-testing/blob/main/ATMA%20Field%20Testing_TRR%202021%20slides.pdf"
PDFdownload: "https://github.com/xbhu/AV-WorkZoneCDA-testing/blob/main/ATMA%20Field%20Testing_TRR%20paper%202021.pdf"
video: "https://www.youtube.com/watch?v=O1Vrhn0wct8"
zh: ""
---

## What problem does this research solve?

Highway maintenance workers face serious risks every day. Operations 
like road striping, pothole patching, and bridge flushing require 
slow-moving trucks on high-speed roads. In 2017 alone, 158,000 
crashes occurred in U.S. work zones, causing 61,000 injuries—many 
involving DOT employees.

The **Autonomous Truck Mounted Attenuator (ATMA)** system is 
designed to eliminate this risk. It operates as a **Leader-Follower 
Cooperative Driving Automation (CDA)** system: a human-driven Lead 
Truck (LT) performs the maintenance work, while a driverless Follow 
Truck (FT) autonomously tracks the LT's position, speed, and heading 
via V2V communication. The FT carries a Truck Mounted Attenuator 
(TMA) on its rear—if a rear-end crash is inevitable, the TMA absorbs 
the impact, and no DOT employee is harmed. The system operates within 
a tightly defined environment (low-speed mobile operations on closed 
or controlled lanes), making it one of the most practical near-term 
applications of autonomous vehicle technology in transportation.

By 2019, several state DOTs—including Colorado and Missouri—had 
already begun purchasing and deploying ATMA vehicles. But a critical 
question remained unanswered: **how well does the system actually 
perform under real-world conditions, and how do we measure that 
rigorously?** No academic evaluation framework existed. This paper 
fills that gap.

## What did we do?

The ATMA system gives operators control over key parameters—such as 
the gap distance between the LT and FT, and operating speed. But 
setting a parameter is not the same as achieving it. A gap of 100 
feet may be maintained easily on a straight road at 10 mph—but what 
happens on a curve? During a lane change? When the LT brakes 
suddenly? When GPS signal is lost?

These are exactly the questions DOTs need answered before committing 
to full deployment.

We designed a field testing program with Missouri DOT in 2019, 
conducted at Fort Walton Beach, FL and Sedalia, MO. The program 
covered 31 test scenarios across four categories:

- **Communication loss**: radio failure, single and dual V2V 
  channel loss, sensor disconnection, GPS-denied environment
- **Following accuracy**: straight roads, curves, lane changes, 
  roundabouts, bump obstacles, U-turns
- **Obstacle detection**: front and side collision avoidance
- **Emergency situations**: emergency stops, human takeover, 
  simulated rear impact, temporary vehicle drop and catch-up

Each quantifiable test was repeated three times to support 
statistical analysis. We then developed an evaluation framework 
to convert raw sensor log data into defensible, quantified 
performance conclusions.

## What can this be used for?

- **DOTs evaluating ATMA procurement**: This paper provides a 
  ready-made testing protocol and performance benchmarks you can 
  reference or adapt for your own evaluation program.
- **DOTs already operating ATMA**: The statistical framework can 
  be used for ongoing performance monitoring and to detect 
  system degradation over time.
- **Researchers studying AV field evaluation**: The methodology 
  applies to any leader-follower or CDA system operating within 
  a constrained, well-defined operational design domain (ODD).

## What is the key methodological contribution?

Standard AV evaluation approaches were not designed for the 
small-sample, repeated-test structure of real-world field testing. 
We developed a **three-layer evaluation framework** built around 
the Cross Track Error (CTE)—the lateral deviation of the FT from 
the LT's intended path:

1. **Statistical characteristics**: Mean, standard deviation, and 
   quantiles of CTE for each test, benchmarked against MoDOT's 
   predefined performance criteria (±6 inches lateral tolerance).
2. **Probability distribution analysis**: What fraction of 
   observations fall within the acceptable tolerance? This 
   translates raw data into a nuanced pass/fail answer—not just 
   whether the system passed, but by how much margin.
3. **Friedman nonparametric hypothesis testing**: Verifies that 
   repeated runs of the same test produce statistically consistent 
   results. This confirms system *stability*, not just one-time 
   performance on a good day.

The Friedman test was specifically chosen because field test data 
is non-normally distributed and sample sizes are modest—conditions 
where standard parametric tests are inappropriate.

## What are the key findings?

- Under most operating conditions, the FT maintained lateral 
  accuracy within **±6 inches** of the LT's path, meeting 
  MoDOT's performance requirements.
- When both V2V radios failed simultaneously, the FT came to a 
  complete stop within **1.9 seconds**—a critical safety result.
- In GPS-denied conditions, the Dead Reckoning Assembly maintained 
  accuracy within **±6 inches for 45 seconds** before initiating 
  a controlled stop—exactly as required.
- Hypothesis testing confirmed **statistically consistent 
  performance across all repeated trials**, indicating the system 
  is stable and repeatable under controlled conditions.
- Tight maneuvers—roundabouts and U-turns—showed higher CTE, 
  with some observations reaching **±10 inches**. This is an 
  important operational boundary for deployment planning: agencies 
  should factor turning geometry into their route design.