---
tldr: >-
  We built a Bayesian network that turns hundreds of thousands of smartphone GPS points per driver into
  a crash-risk estimate, and showed that adding road and traffic context makes the estimate track
  drivers' real crash records about four times more closely than speed and acceleration alone.
hero:
  image: /media/zhu-bayesian-driving-risk-trc-2017/gps-to-crash-risk.png
  alt: >-
    Diagram with four boxes from left to right. GPS readings from the driver's phone, with five tags:
    speed and acceleration in gray, road type, speed limit and traffic speed in yellow. An arrow leads to
    two dark boxes labeled hidden layers learned by the model: driving behavior, then crash risk, drawn
    as a bell-shaped range. A driver profile box (age, gender, miles per year) feeds into crash risk. A
    last arrow leads to crash history reported in a survey, drawn as a small bar chart of 0, 1, 2, 3 and 4 or more crashes
  caption: >-
    The model links what a driver's phone records to that driver's crash history through two hidden
    layers: driving behavior and crash risk. The yellow readings are the context. Remove them and the
    same model becomes the non-contextual version we compared against. Diagram based on Figure 2 of the paper.
affiliations:
  - Metropia, Inc.
  - University of Arizona
  - Illinois State University
author_affiliations: [[1], [2], [1], [2], [3]]
abstract: |-
  Driving behavior is generally considered to be one of the most important factors in crash occurrence. This paper aims to evaluate the benefits of utilizing context-relevant information in the driving behavior assessment process (i.e. contextual driving behavior assessment approach). We use a Bayesian Network (BN) model that investigates the relationships between GPS driving observations, individual driving behavior, individual driving risks, and individual crash frequency. In contrast to prior studies without context information (i.e. non-contextual approach), the data used in the BN approach is a combination of contextual features in the surrounding environment that may contribute to crash risk, such as road conditions surrounding the vehicle of interest and dynamic traffic flow information, as well as the non-contextual data such as instantaneous driving speed and the acceleration/deceleration of a vehicle. An information-aggregation mechanism is developed to aggregate massive amounts of vehicle GPS data points, kinematic events and context information into driver-level data. With the proposed model, driving behavior risks for drivers is assessed and the relationship between contextual driving behavior and crash occurrence is established. The analysis results in the case study section show that the contextual model has significantly better performance than the non-contextual model, and that drivers who drive at a speed faster than others or much slower than the speed limit at the ramp, and with more rapid acceleration or deceleration on freeways are more likely to be involved in crash events. In addition, younger drivers, and female drivers with higher VMT are found to have higher crash risk.
key_numbers:
  - { value: "307,204", label: "trips recorded by a smartphone app, 2.6 million miles in all" }
  - { value: "521", label: "drivers who reported their crash history in a survey" }
  - { value: "4×", label: "closer match to real crash records with context (correlation 0.576 vs. 0.143)" }
  - { value: "6", label: "road types, from freeway to HOV lane, each with its own driving habits" }
updated: 2026-10-27
---

## What problem does this research solve?

Insurers, safety programs and driver-feedback apps increasingly judge drivers from the data their cars and phones record. Most of these scores look only at the vehicle itself: how fast it went and how hard it sped up or braked. We call this the **non-contextual** approach.

The trouble is that the same numbers can mean very different things. A driver who keeps stopping and starting may be aggressive, or may just be stuck in heavy traffic. A driver who is always much faster than the cars around them is probably driving more aggressively than most, but you can only tell that if you know how fast the surrounding traffic was moving. A **contextual** approach adds this missing information: the type of road, its speed limit and the live traffic speed at that place and time.

Two practical problems stand in the way. First, the data are enormous and uneven: one driver in the study had 111,490 GPS points, another 686,355, while each driver has only a handful of crashes, or none. Second, nobody had measured how much context actually helps. This paper builds a model that handles both, and puts a number on the benefit.

## What did we do?

Drivers in the study used a smartphone navigation app run by Metropia, which recorded the GPS trace of each trip. The dataset covers **307,204 trips and 2,611,838 miles**, mostly in Tucson, Austin and El Paso. A map-matching program placed every GPS point on its road segment, which supplied the road type, the speed limit and the average speed of traffic on that segment at that moment. Points recorded below 5 mph at the start or end of a trip, such as in a parking lot, were removed.

<figure>
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/metropia-app-screens.jpg" alt="Four phone screenshots of a navigation app. First, a map with a planned route and a table of leave times, arrival times and reward points, with a Reserve Trip button. Second, a list of reserved trips with leave-now and scheduled times. Third, turn-by-turn navigation on a map. Fourth, an arrival screen showing 0.5 lbs of CO2, 70 points and 1.3 minutes" loading="lazy" />
  <figcaption>The navigation app that collected the trips: drivers planned and reserved a trip, followed turn-by-turn directions, and the phone logged the GPS trace along the way. Image: Metropia, from the PAYDAYS project workshop slides.</figcaption>
</figure>

App users who had completed at least 10 trips were asked in a survey about their age, gender, annual mileage and crash history. **521 drivers** answered. Their average age was 37, 54% were women, they drove about 9,800 miles a year, and they reported 0.76 crashes on average. Across these drivers, 56% of GPS points were on arterials, 18% on freeways, 17% on minor roads, 5% on highways, 3.5% on ramps and 0.6% in HOV lanes.

<figure>
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/crash-counts-poisson.png" alt="Line chart of the share of drivers reporting 0 to 5 crashes. The red line for real crash counts starts at about 0.52 for zero crashes, falls to about 0.29 for one and 0.11 for two, and is near zero after that. A dashed black line for the fitted Poisson curve follows it closely" loading="lazy" />
  <figcaption>About half of the surveyed drivers reported no crash at all. Crash counts like these follow a Poisson pattern (dashed line), which is how the model links each driver's crash risk to the crashes they reported. Image: from the paper.</figcaption>
</figure>

We then built the same model twice. The **contextual model** sees every GPS point together with its road type, speed limit and traffic speed. The **non-contextual model** sees only the vehicle's speed and acceleration. Comparing the two on the same drivers shows what context is worth.

## What is the key methodological contribution?

The core of the paper is a hierarchical **Bayesian network**: a chain of linked probability models in which each step has a plain physical meaning (see the diagram at the top).

1. **From GPS points to driving behavior.** For each driver, the model summarizes millions of readings into a compact profile: how much of their driving is on each road type, how far they usually are from the speed limit and from the traffic around them, how often they speed up or slow down, and how hard.
2. **From behavior to crash risk.** A regression links that profile, plus age, gender and annual mileage, to the driver's expected number of crashes per year.
3. **From crash risk to crash history.** Each driver's reported crashes are treated as a random count that depends on their risk and on how many years of driving the history covers.

Two design choices make this work on real data. First, habits are learned **road type by road type**. When GPS points from all roads are pooled, the core of the speed pattern is lopsided and irregular; on freeways alone it is one smooth oval. So the model keeps six road types apart: freeway, ramp, arterial, highway, minor road and HOV lane.

<figure class="figure-row">
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/speed-mixed-roads.jpg" alt="Density map of GPS points, speeding value across and speed difference from traffic up. With all road types mixed, the bright core is lopsided and irregular, with a narrow streak toward the upper right" loading="lazy" />
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/speed-freeway-only.jpg" alt="The same density map for freeway points only. The bright core is a single smooth oval near the center, with a faint haze to the left" loading="lazy" />
  <figcaption>Each map shows where GPS points fall by speed compared with the limit (across) and compared with surrounding traffic (up). Left: all road types mixed. Right: freeways only, a single smooth core. Image: from the paper.</figcaption>
</figure>

Second, the Bayesian approach copes with uneven data. A driver with few GPS points is not ignored. Their estimate starts from what is typical, based on a database of over 10 million trajectory points from more than 2,000 drivers, and moves toward their own habits as data accumulate. The result is not a single risk score but a **range of likely values**, which narrows as the app collects more driving data.

## What are the key findings?

- **Context makes the risk estimate meaningful.** With context, the model's estimated risk rises steadily as drivers' actual crash rates rise. Without it, the estimate barely moves. The correlation with drivers' crash records was **0.576 with context versus 0.143 without**, and the pseudo-R² was 0.384 versus 0.014.

<figure>
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/contextual-vs-noncontextual.png" alt="Box plot of the model's estimated risk (up) for groups of drivers by their actual crash rate (across, from 0 to 1). Red boxes for the contextual model rise from about 0.12 at 0 to about 0.22 at the high end. Teal boxes for the non-contextual model stay near 0.16 to 0.20 throughout" loading="lazy" />
  <figcaption>Drivers grouped by their actual crash rate (across: reported crashes per year). With context (red), the model's estimate climbs with the actual rate; without context (teal), it stays flat. Image: from the paper.</figcaption>
</figure>

- **Ramps are where speed habits show.** Drivers who go faster than the surrounding traffic on ramps had a higher crash rate. There was also weaker evidence that driving well below the speed limit on ramps goes with higher risk. Speed habits on other road types were not significant, and neither were they in the non-contextual model.
- **Frequent speed changes on freeways signal risk.** Drivers who speed up and slow down more often on freeways and ramps had higher crash risk. These driving-behavior effects are statistically modest (10% level), and they can only be seen when each GPS point is tagged with its road type.
- **One result was unexpected.** Drivers whose acceleration varied more in HOV lanes had *lower* risk. HOV lanes made up only 0.6% of the data, which may explain this.
- **Who drives matters too.** Younger drivers had the highest risk, and age was the strongest factor. Drivers who travel more miles had higher risk. With driving behavior controlled for, women had higher risk than men, unlike in many earlier studies.

Because the model gives each driver a range rather than a single number, it also says how sure it is. Drivers with more GPS data have tighter estimates.

<figure>
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/more-data-more-certainty.png" alt="Scatter plot of the variance of each driver's risk estimate (up) against the number of GPS points (across, up to one million). Points are spread widely at the left and a trend line slopes gently downward" loading="lazy" />
  <figcaption>Each dot is one driver. The more GPS points the app collected (across), the smaller the uncertainty in that driver's risk estimate (up). Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/zhu-bayesian-driving-risk-trc-2017/two-drivers-risk-range.png" alt="Two curves of estimated crash risk. Driver A, solid black, with 111,490 GPS points, has a lower and wider curve with a long right tail. Driver B, dashed red, with 686,355 GPS points, has a taller and narrower curve. Both peak near 0.1" loading="lazy" />
  <figcaption>Two drivers with similar profiles and the same crash history. Their average risk is close (0.13 and 0.12 crashes per year), but driver B (red, 686,355 GPS points) has a much narrower range than driver A (black, 111,490 points). Using the 95% upper bound, A's risk could be as high as 0.27, B's only 0.20. Image: from the paper.</figcaption>
</figure>

These results rest on self-reported crash histories and assume that adults' driving habits stay stable over several years. Fitting the model took about 20 hours on a desktop PC.

## What can this be used for?

- **Usage-based insurance:** insurers can price risk from how people actually drive, read against the road and traffic they drive in, rather than from raw speed and braking counts that penalize drivers stuck in congestion.
- **Fair treatment of new customers:** a new driver gets a first estimate from their profile alone, which is then updated as GPS data arrive. The width of the range tells the insurer how much to trust it.
- **Driver feedback and safety programs:** the results point to specific places and habits, such as keeping pace with traffic on ramps and driving smoothly on freeways, that feedback can target.

Two companion pages from the same project use the same kind of contextual data in other ways: [one scores trips by comparing each driver's speed with the surrounding traffic](/hu-ubi-contextual-risk-ietits-2019/), and [another shows how an insurer can turn such data into car insurance prices](/ma-ubi-rate-making-tra-2018/).

This work was supported by the Federal Highway Administration's Pay-As-You-Drive-And-You-Save (PAYDAYS) Insurance Actuarial Study.
