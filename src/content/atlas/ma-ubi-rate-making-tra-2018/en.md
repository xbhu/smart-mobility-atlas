---
tldr: >-
  Using 131,537 smartphone-recorded trips by 503 drivers, we showed how an insurer can turn
  second-by-second GPS data into car insurance prices, and found that context matters: driving well
  below the speed of fast-moving traffic raised the chance of an at-fault accident by 37%, and an
  insurer that ignores how drivers keep pace with traffic could under-charge by 30%.
hero:
  image: /media/ma-ubi-rate-making-tra-2018/habits-and-accident-risk.png
  alt: >-
    Bar chart of how ten driving habits change the chance of an at-fault accident. Blue bars for
    habits measured from the car alone: hard braking +11.0%, hard starts +7.9%, peak-hour travel
    +3.2%. Yellow bars for habits that need road and traffic context: speeding in congestion +11.9%,
    speeding in free flow where the limit is 60 mph or more +25.6%, and under 60 mph +18.9%; driving
    faster than traffic +9.8% when traffic is under 40 mph and +3.9% at 40 mph or more; driving slower
    than traffic −5.8% when traffic is under 40 mph and +37.1% at 40 mph or more
  caption: >-
    The biggest risk in the data is one a plain GPS trace cannot see: driving well below the speed of
    the cars around you on a road where traffic moves at 40 mph or more. Driving slower than traffic on
    a slow road, by contrast, goes with fewer accidents. Chart based on Table 8 of the paper.
affiliations:
  - University of North Texas
  - Metropia, Inc.
  - Missouri University of Science and Technology
  - University of Arizona
author_affiliations: [[1], [2], [3], [4]]
abstract: |-
  Historically, auto insurers use various socio-demographic underwriting factors to differentiate driver risks. With the invention of GPS devices, information such as mileage, traffic condition and driving habits can be incorporated into auto insurance premium calculation. Several major auto insurance companies have offered usage based insurance (UBI) programs where auto insurance premiums are sensitive to actual GPS readings combined with driver's driving behavior. However, given that telematics data are proprietary to the insurance companies that collect such data, the accessibility of UBI is extremely limited.

  In this research we showcase how second-by-second GPS data can be integrated into existing or new auto insurance pricing structures. We use two types of data: real-time GPS trajectory data collected using a traffic app, as well as survey data. We incorporate vehicle trajectories and accident data to quantify the relationship between driving hazard and accidents with the goal of establishing the linkage between driving risks and accident costs. GPS data considered in this study include not only tradition UBI factors, but also the unique contextual-based risk measurements that compares the driving speed of the vehicle with other drivers on the same road segment. Although smartphone data is used in this study, the methodology developed can be applied to GPS trajectory data collected from other devices such as on-board diagnostics (OBD) or black box solutions. We find that hard brakes, hard starts, peak time travel, speeding as well as driving at a speed significantly different from traffic flow are highly correlated with accident rate. We illustrate the potential underwriting loss an insurer may incur resulting from adverse selection if omitting pertinent risk factors. The results of our study can help insurance companies that are interested in getting into the UBI area set up their auto insurance premium rates.
key_numbers:
  - { value: "131,537", label: "trips by 503 drivers over 18 months" }
  - { value: "162 million", label: "GPS points, one every second" }
  - { value: "+37%", label: "chance of an at-fault accident when driving well below the speed of fast traffic" }
  - { value: "30.1%", label: "premium under-charge for an insurer that ignores speed relative to traffic" }
updated: 2026-10-27
---

## What problem does this research solve?

Car insurers have long set prices from facts that are easy to check: a driver's age, gender, driving experience and how many miles they drive. How a person actually drives is one of the biggest causes of crashes, but until recently insurers simply could not see it.

GPS changed that. **Usage-based insurance** (UBI), also called pay-as-you-drive insurance, prices each policy partly from the driver's own trips. By the time of this study, UBI programs were offered in more than 40 U.S. states by insurers including Progressive, State Farm, Allstate and Travelers, and the Brookings Institution had suggested that pay-as-you-drive pricing, by encouraging people to cut unnecessary driving, could yield $50 to $60 billion in social benefits.

Two problems held UBI back:

- **The data stay inside a few large insurers.** The telematics data these programs collect belong to the companies that collect them, and the devices are expensive. Smaller insurers, and the state regulators who must approve new rating plans, had little public evidence on how to turn GPS data into a fair price.
- **The measures ignore context.** Programs flag hard braking, fast starts, late-night driving or a fixed top speed, for example 80 mph in one program, or 75 mph anywhere in an informal 2014 test of another program's app. None of them ask how fast the other cars on the same road were going at the time.

<blockquote class="pull-quote">
  <p>Pricing matters for more than fairness. <strong>When an insurer cannot tell low-risk drivers from high-risk ones and charges them all the same, careful drivers move to insurers that reward them.</strong> The insurer is left with the riskier customers at a price set for the average driver, a problem economists call adverse selection. <strong>This paper shows, with real data, how to price driving behavior and what it costs an insurer not to.</strong></p>
</blockquote>

## What did we do?

This study was part of the Federal Highway Administration's **Pay-As-You-Drive-And-You-Save (PAYDAYS)** Insurance Actuarial Study. From January 2015 to July 2016, drivers using the Metropia traffic app on their smartphones recorded their trips. The phone's GPS logged the car's position and speed every second, about **162 million points** in all. On the server, every point was matched to the road link the car was on, with that link's speed limit and the **average speed and volume of the other vehicles on it** at that moment.

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Time</th><th scope="col" class="num">Driver's speed</th><th scope="col" class="num">Road link</th><th scope="col" class="num">Speed of other traffic</th><th scope="col" class="num">Traffic volume</th><th scope="col" class="num">Speed limit</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">7:58:11 am</th><td class="num">34.7 mph</td><td class="num">9171</td><td class="num">36.6 mph</td><td class="num">940 veh/h</td><td class="num">40 mph</td></tr>
        <tr><th scope="row">7:58:12 am</th><td class="num">36.4 mph</td><td class="num">9171</td><td class="num">36.6 mph</td><td class="num">940 veh/h</td><td class="num">40 mph</td></tr>
        <tr><th scope="row">7:58:13 am</th><td class="num">36.9 mph</td><td class="num">9171</td><td class="num">36.6 mph</td><td class="num">940 veh/h</td><td class="num">40 mph</td></tr>
        <tr><th scope="row">7:58:14 am</th><td class="num">38.0 mph</td><td class="num">9171</td><td class="num">36.6 mph</td><td class="num">940 veh/h</td><td class="num">40 mph</td></tr>
        <tr><th scope="row">7:58:15 am</th><td class="num">38.6 mph</td><td class="num">9171</td><td class="num">36.6 mph</td><td class="num">940 veh/h</td><td class="num">40 mph</td></tr>
        <tr class="is-highlight"><th scope="row">7:58:16 am</th><td class="num">38.6 mph</td><td class="num">4584</td><td class="num">37.1 mph</td><td class="num">890 veh/h</td><td class="num">35 mph</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Six seconds of one driver's trip on the morning of April 9, 2016, simplified from Table 1 of the paper. Each second, the car's own speed sits next to the speed of the traffic around it and the posted limit. In the last row the car enters a new road link with a 35 mph limit: it is now speeding, even though it is only about 1.5 mph faster than the cars around it.</figcaption>
</figure>

App users who had made more than 10 trips were invited to a survey about their age, gender, driving experience, annual mileage and accidents. Of the 525 drivers who answered, we left out the 22 under 20 or over 60, too few to analyze and none with an accident in the past year. That left **503 drivers and 131,537 trips**. Most had a clean record: 431 (85.7%) reported no at-fault accident in the past three years, 65 reported one, and 7 reported two.

<figure>
  <img src="/media/ma-ubi-rate-making-tra-2018/data-pipeline.png" alt="Flow diagram. Three sources, vehicle trajectory, roadway geometry and traffic dynamics, feed a data fusion step that matches every GPS point to its road link and traffic. That produces five second-by-second measures: hard brake, hard start and time of travel, plus speeding and relative speed, which are marked as context-aware. These become trip-level measures, which are combined with a driver survey on age, gender, experience, mileage and at-fault accidents, and feed insurance models of the chance and number of accidents and then premiums" loading="lazy" />
  <figcaption>From GPS points to insurance prices. The two yellow measures are context-aware: they judge a driver's speed against the speed limit, the congestion and the speed of the other cars on that road at that moment. Diagram based on the data collection flow chart in the authors' manuscript.</figcaption>
</figure>

## What is the key methodological contribution?

The paper builds driving measures an insurer can use directly, and the new ones are **context-aware**:

- **Relative speed** compares the driver's speed with the average speed of the other vehicles on the same road at the same moment. Being much faster *or* much slower than the flow both count, and each is split by whether traffic is moving under or over 40 mph, since a 10 mph gap means something different at 35 mph than at 65 mph.
- **Speeding** is the speed over the posted limit, split by whether the road is congested and whether the limit is under or over 60 mph. Ten mph over the limit carries a different risk on a freeway than on an arterial street, and in a jam than in open traffic.
- **Hard braking, hard starts and peak-hour travel**, the measures common in today's programs, are included too, so the new measures are tested against the familiar ones.

<figure>
  <img src="/media/ma-ubi-rate-making-tra-2018/relative-speed-distribution.png" alt="Histogram of relative speed from −20 to +20 mph. The bars rise from about 0.01 on the left to a peak of about 0.043 between +4 and +6 mph, then fall to about 0.01 at +20 mph" loading="lazy" />
  <figcaption>How a driver's speed compares with the traffic around them, second by second (mph; positive means faster than traffic). The most common behavior is driving 4 to 6 mph faster than the flow. On average, 38% of a trip is spent at least 10 mph faster or slower than the surrounding traffic. Image: from the paper.</figcaption>
</figure>

Because no industry standard exists for what counts as a "hard" brake or "too fast", the paper tests several cutoffs: hard brakes and starts at 10, 12 and 15 ft/s², speeding at 5, 8 and 10 mph over the limit, and relative speed from 5 mph to 100% of the traffic speed. At the 10 ft/s² cutoff, drivers averaged about 13 hard brakes per 100 miles. Each trip is then flagged if it had any hard brake or hard start, if its share of time speeding or off the traffic speed falls in the top quarter of all trips, and as peak-hour travel if most of it took place between 7 and 9 am or 5 and 7 pm.

<figure>
  <img src="/media/ma-ubi-rate-making-tra-2018/trips-by-hour.png" alt="Histogram of trips by hour of day from 0 to 23. Few trips before 5 am, a morning peak at 7 am of about 0.09, a plateau around 0.05 through midday, an evening peak at 5 pm of about 0.10, then a decline into the night" loading="lazy" />
  <figcaption>When the trips took place, by hour of day. The morning and evening peaks are clear; trips taken mostly between 7 and 9 am or 5 and 7 pm were flagged as peak-hour travel. Image: from the paper.</figcaption>
</figure>

Finally, we used **generalized linear models**, the main method insurers use to set car insurance prices: a logit model for whether a driver had any at-fault accident in the past three years, and a Poisson model for how many. Both models gave consistent results. From the logit model we turned the results into a **probability of a loss and an actuarially fair premium** for drivers with each combination of habits, and then simulated what happens to an insurer that leaves a factor out of its prices.

## What are the key findings?

**The familiar factors behave as expected.** A female driver's chance of an at-fault accident was about a third lower than a similar male driver's, and drivers aged 30 to 44 had a 35.8% lower chance than drivers under 30. Drivers who cover more than 15,000 miles a year had about twice the chance of drivers under 7,500 miles, which supports pricing by mileage.

**Common UBI habits matter.** Hard braking raised the chance of an at-fault accident by 11.0%, hard starts by 7.9%, and peak-hour travel by 3.2%, as the chart at the top of the page shows.

**Context matters even more.**

- **Speeding** raised the chance of an accident by 11.9% to 25.6%, depending on the speed limit and whether traffic was congested. The largest effect was speeding in open traffic on roads with limits of 60 mph or more.
- **Driving faster than traffic** was riskier on both slow and fast roads.
- **Driving well below the speed of traffic on a road where traffic moves at 40 mph or more** was the largest risk in the study, raising the chance of an accident by **37.1%**. One possible explanation is that a driver going much slower than fast traffic may not be paying attention to it.
- **Driving slower than traffic on a slow road** (under 40 mph) went with a 5.8% *lower* chance of an accident: on slow, busy streets, holding back is a sign of caution.

The same habit can be risky or safe depending on the traffic around the car, which a device that only records the car's own speed cannot tell apart.

**Driving habits translate into very different prices.** For a 40-year-old with more than 10 years of experience who drives 12,000 miles a year:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Speeds in congestion</th><th scope="col">Speeds in open traffic, limit 60+ mph</th><th scope="col">Speeds in open traffic, limit under 60 mph</th><th scope="col" class="num">Fair premium, male</th><th scope="col" class="num">Fair premium, female</th></tr>
      </thead>
      <tbody>
        <tr class="is-highlight"><th scope="row">No</th><td>No</td><td>No</td><td class="num">$1,200</td><td class="num">$764</td></tr>
        <tr><th scope="row">Yes</th><td>No</td><td>No</td><td class="num">$1,359</td><td class="num">$869</td></tr>
        <tr><th scope="row">No</th><td>No</td><td>Yes</td><td class="num">$1,453</td><td class="num">$931</td></tr>
        <tr><th scope="row">No</th><td>Yes</td><td>No</td><td class="num">$1,545</td><td class="num">$992</td></tr>
        <tr><th scope="row">Yes</th><td>No</td><td>Yes</td><td class="num">$1,642</td><td class="num">$1,057</td></tr>
        <tr><th scope="row">Yes</th><td>Yes</td><td>No</td><td class="num">$1,744</td><td class="num">$1,125</td></tr>
        <tr><th scope="row">No</th><td>Yes</td><td>Yes</td><td class="num">$1,862</td><td class="num">$1,205</td></tr>
        <tr class="is-highlight"><th scope="row">Yes</th><td>Yes</td><td>Yes</td><td class="num">$2,096</td><td class="num">$1,364</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Actuarially fair premiums by speeding habit, from Table 9 of the paper, with $1,200 assumed as the price for a male driver who rarely speeds. A driver who tends to speed in every situation would fairly pay about 75% more than one who does not. The paper assumes the same cost per accident throughout and prices only how often accidents happen.</figcaption>
</figure>

**Ignoring driving data is costly.** Suppose an insurer charges every driver the same average price and leaves out a factor. Low-risk drivers leave for insurers that reward them, and the insurer is left with the riskier ones.

<figure>
  <img src="/media/ma-ubi-rate-making-tra-2018/undercharge.png" alt="Bar chart of the premium under-charged per male policyholder when an insurer leaves out one factor: peak-hour travel $22, hard starts $102, hard braking $130, hard braking and starts $189, speeding in context $208, speed relative to traffic $397. The last two bars, which need road and traffic context, are yellow; the others are blue" loading="lazy" />
  <figcaption>The two context-aware measures cost an insurer the most when left out. Leaving out speeding under-charges male drivers by $208 (16%) and female drivers by $145 (18.1%). Leaving out speed relative to traffic under-charges them by $397 and $261: an under-charge of 30.1%.</figcaption>
</figure>

The study has limits. No study driver had an accident during the 18 months of data collection, so the analysis relates today's driving to accidents reported for the past three years, assuming habits stay much the same. It also assumes the same cost per accident, and does not count what it costs an insurer to collect and process the data.

## What can this be used for?

- **Insurers starting a UBI program**, especially smaller ones without their own telematics data: the paper gives a step-by-step recipe, from raw GPS points to risk flags, accident models and premiums, using the same models insurers already use.
- **State insurance regulators**: the results provide actuarial evidence that the behaviors in a UBI rating plan are linked to accident risk, which insurers need when seeking approval for such plans.
- **Any GPS source**: the data came from smartphones, but the method applies just as well to plug-in on-board diagnostics (OBD) devices or black boxes that record at the same one-second rate.
- **Fairer, safer driving incentives**: pricing context-aware habits rewards drivers for keeping pace with traffic rather than for simply avoiding a fixed top speed, and gives agencies such as FHWA evidence for pay-as-you-drive programs that encourage safer, less driving.

Two companion pages from the same project use the same kind of contextual data in other ways: [one builds driver-level scores and groups drivers by driving style](/hu-ubi-contextual-risk-ietits-2019/), and [another turns each driver's GPS points into a crash-risk estimate with a Bayesian network](/zhu-bayesian-driving-risk-trc-2017/).

This research was supported by the Federal Highway Administration's Pay-As-You-Drive-And-You-Save (PAYDAYS) Insurance Actuarial Study, contract DTFH61-13-C-00033.
