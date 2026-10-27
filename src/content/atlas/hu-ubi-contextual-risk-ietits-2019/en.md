---
tldr: >-
  We scored 69,283 smartphone-recorded trips against the road and the live traffic around each car,
  and found that drivers who keep their speed in step with traffic and drive smoothly report fewer
  at-fault crashes: the kind of evidence usage-based car insurance needs to price risk fairly.
hero:
  image: /media/hu-ubi-contextual-risk-ietits-2019/same-gap-different-context.png
  alt: >-
    Two road diagrams side by side. Left, a free-flowing arterial where traffic averages 45 mph and a
    yellow car drives 52 mph, labeled less risky. Right, a congested road where traffic averages 15 mph
    and a yellow car drives 22 mph, weaving into the next lane, labeled more risky
  caption: >-
    Driving 7 mph faster than the cars around you means different things on different roads: on an
    open arterial it is keeping up with the flow, in congestion it means constant lane changes to pass.
    A plain GPS speed record treats these two drivers alike; our contextual measures do not. Diagram based on an example in the paper.
affiliations:
  - Missouri University of Science and Technology
  - Metropia, Inc.
  - University of North Texas
  - University of Arizona
author_affiliations: [[1], [2], [3], [4], [1]]
abstract: |-
  Traditional driving risk analysis reveals driving risk factors based on the correlation analysis at the aggregate level, and typically does not go down to the individual level due to the absence of personalized driving data. While some recent efforts applied the latest information and communications technology (ICT) for data collection and driving behavior evaluation, most researchers and practitioners currently rely solely on user GPS trajectories, without considering other critical risk factors in the surrounding environment that may also contribute to crash risk, i.e. the context-sensitive risk factors. A new approach that collects individualized driving behavior data from smartphone GPS module, combined with geographical network information and dynamic traffic conditions, is proposed to identify driving risk factors and evaluate driving behaviors in various contexts. The multi-source data reveals real world activity patterns as to when, where and how an individual driver performs, from which performance measurements on both the trip and driver level are defined to measure the risks in those patterns. Data is collected from a total of 69,283 trips from 255 users and numeric analysis is performed and summarized in this paper.
key_numbers:
  - { value: "69,283", label: "trips recorded by drivers' smartphones over one year" }
  - { value: "255", label: "drivers in Tucson and Austin with both trip data and crash history" }
  - { value: "2", label: "factors, pedal and speed, that sum up ten driver scores" }
  - { value: "5", label: "groups of drivers with similar driving habits" }
updated: 2026-10-27
---

## What problem does this research solve?

**Usage-based insurance** (UBI), sometimes called pay-as-you-drive insurance, sets a driver's premium from how they actually drive rather than only from age, gender or ZIP code. To do that fairly, an insurer needs driving scores that really predict crashes.

Most driving scores today are built from the car's own GPS or sensor trace: how fast it went, how hard it braked, how often it sped up suddenly. What these traces leave out is the **context**. A burst of hard braking might be a careless driver, or it might be stop-and-go traffic that every driver on that road is fighting through. A driver who goes 7 mph faster than everyone else is just keeping up on an open arterial, but on a jammed road the same 7 mph means weaving from lane to lane to get past other cars.

Older crash research has the opposite gap. It finds risk factors such as age, alcohol or inexperience by comparing large groups of drivers, but it rarely has data on how each individual actually drives. We set out to measure each person's driving in context, and then check whether those measures line up with real crash histories.

## What did we do?

From January 2015 to January 2016, drivers using the Metropia navigation app recorded their trips: the phone's GPS logged position and speed every second. On the server, every GPS point was matched to the road link the car was on, with that link's road type and speed limit, and to the **average speed of traffic on that link** at that moment, updated every 5 minutes from a national traffic data provider. In total we collected **69,283 trips**.

<figure>
  <img src="/media/hu-ubi-contextual-risk-ietits-2019/data-fusion-pipeline.png" alt="Flow diagram. Three boxes, smartphone GPS, road network and traffic conditions, feed a step that matches each GPS point to its road link and traffic. That produces five measures: relative speed and speeding, marked context-aware, plus smoothness, hard braking and hard starts. These become trip scores, then a driver profile, which is compared with a crash history survey" loading="lazy" />
  <figcaption>How three data sources become a driver profile. The two yellow measures are context-aware: they judge a driver's speed against the traffic and congestion on that road at that moment.</figcaption>
</figure>

We then asked frequent app users (at least 10 trips) about their crash history and background. **255 drivers in Tucson, Arizona, and Austin, Texas,** had both good GPS data and survey answers: 136 women and 119 men, aged from under 20 to over 65 (average 37), who drive about 10,800 miles a year. Most had a clean recent record: 221 reported no at-fault crash in the past three years, 30 reported one, and 4 reported more than one.

<figure>
  <img src="/media/hu-ubi-contextual-risk-ietits-2019/crash-history.png" alt="Bar chart of the number of drivers with no, one, or two or more crashes, in four groups: total crashes in the last 3 years, at-fault crashes in the last 3 years, total crashes in the last year and at-fault crashes in the last year. In every group the no-crash bar is far the tallest, between about 170 and 240 drivers" loading="lazy" />
  <figcaption>Self-reported crash histories of the 255 drivers. Crashes are rare events, so most drivers report none; the study focuses on at-fault crashes in the past three years. Image: from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The paper defines five driving measures that are calculated every second along a trip:

- **Relative speed** (context-aware): how far the driver's speed is from the average speed of the other traffic on the same road at the same time. Being much faster *or* much slower than the flow both count as risky, because either one forces other drivers to brake, accelerate or change lanes. The score also weighs the gap by how fast traffic is moving and how congested the road is.
- **Speeding** (context-aware): how far above the posted speed limit, adjusted for road type and congestion, since 10 mph over the limit carries a different risk on a freeway than on an arterial.
- **Smoothness**: the share of time, while moving faster than 10 mph, that the car holds a steady speed without noticeable speeding up or slowing down.
- **Hard braking** and **hard starts**: how often the car slows faster than about 12 ft/s² or speeds up faster than about 10 ft/s². These are rare: fewer than 10% of trips include even one.

Each trip's score is the time-weighted average of these measures, ranked from 0 (worst) to 1 (best) against all trips. Each driver then gets **ten scores**: their average trip and their worst trip on each of the five measures. Looking at the worst trip, not just the average, captures drivers who are usually careful but occasionally very aggressive.

Many of the ten scores overlap, so we used principal component analysis to find what they have in common. They boil down to **two factors**: a **pedal factor**, made up of hard braking and hard starts, and a **speed factor**, made up of relative speed, speeding and worst-trip smoothness.

<figure>
  <img src="/media/hu-ubi-contextual-risk-ietits-2019/pedal-and-speed-factors.png" alt="Table of ten driver scores against two factors. Hard braking and hard starts, for both the average and the worst trip, have dark cells between 0.76 and 0.89 under the pedal factor. Speeding, relative speed and worst-trip smoothness have dark cells between 0.54 and 0.82 under the speed factor. Average-trip smoothness is weak on both" loading="lazy" />
  <figcaption>Ten driver scores collapse into two factors. Dark cells show which scores make up each factor: brake and gas pedal habits on the left, keeping pace with traffic and the speed limit on the right.</figcaption>
</figure>

Using these two factors, a clustering method sorted the drivers into **five groups**. The largest group (88 drivers) is good on the pedals but less steady on speed; 51 drivers are good on both; 62 often speed or drift away from the traffic speed while using the pedals gently; 30 control speed well but brake and accelerate hard; and 24 do poorly on both.

<figure>
  <img src="/media/hu-ubi-contextual-risk-ietits-2019/driver-groups.png" alt="Scatter plot of drivers by pedal score on the horizontal axis and speed score on the vertical axis, with five marker shapes for groups G1 to G5. G1 sits at upper right, G2 in the middle right, G3 at lower right, G4 at upper left and G5 at lower left" loading="lazy" />
  <figcaption>Each mark is one driver, placed by pedal score (across) and speed score (up); higher is better on both. G1 (upper right) drives well on both; G3 (lower right) uses the pedals gently but struggles with speed; G5 (lower left) is weak on both. Image: from the paper.</figcaption>
</figure>

## What are the key findings?

We modeled the number of at-fault crashes each driver reported over the past three years with negative binomial regression, a standard model for crash counts, controlling for age and annual mileage. Three versions of the model used the ten detailed scores, the two factors, or the five groups.

- **Driving habits measured today are linked with past crashes.** Drivers with smoother acceleration on average, and drivers whose *worst* trip still kept close to the traffic speed, reported significantly fewer at-fault crashes.
- **Speed control matters more than pedal use.** The speed factor was linked with fewer at-fault crashes, while the pedal factor was not. Drivers in the two groups with weaker speed control (G2 and G3) reported more at-fault crashes than the group that drives well on both counts (G1). These group and factor results are weaker statistically (10% level) but point the same way.
- **Context changes the meaning of the numbers.** The measures that best predicted crashes include relative speed, which only exists when each GPS point is compared with the traffic around it.
- **Exposure still counts.** In every model, people who drive more than 15,000 miles a year reported more at-fault crashes. Drivers aged 35 to 39 reported fewer.

These results rest on self-reported crash histories, and they assume that how someone drives today reflects how they drove over the past few years.

## What can this be used for?

- **Insurers building usage-based insurance programs:** context-aware driving scores separate risky drivers from drivers who simply commute on congested roads, which makes premiums fairer.
- **Lower-cost data collection:** a smartphone app costs far less than an on-board telematics device and can reach many more drivers, which could help usage-based insurance spread more widely.
- **Driver feedback and safety programs:** the scores show which habit, such as keeping pace with traffic, matters most, so feedback can focus on it.

This work was supported by the Federal Highway Administration's Pay-As-You-Drive-And-You-Save (PAYDAYS) Insurance Actuarial Study.
