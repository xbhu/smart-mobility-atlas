---
tldr: >-
  We followed individual drivers through a planned lane closure on Austin's MoPac Expressway using
  second-by-second GPS traces from a navigation app, and found that those who detoured did so in
  three distinct ways, each explained mostly by where their trip started and ended.
hero:
  image: /media/hu-capacity-reduction-gps-jits-2019/detour-patterns.jpg
  alt: Three maps of Austin, numbered 1 to 3, each with black GPS traces of detouring trips. In map 1 a few short traces run just east of MoPac near downtown. In map 2 long traces run far north toward Cedar Park and southwest along 360 and 290. In map 3 a dense web of traces crosses downtown in every direction
  caption: >-
    The three ways drivers detoured around the MoPac lane closure, found automatically from GPS
    traces. 1: short trips that left the freeway for a local arterial. 2: long trips that switched to
    another freeway. 3: trips starting or ending downtown that left MoPac early or joined it late.
  credit: From the paper
affiliations:
  - Missouri University of Science and Technology
  - University of Arizona
  - Metropia Inc.
  - Old Dominion University
  - University of Canterbury
author_affiliations: [[1], [2], [3], [4], [5]]
abstract: |-
  Pre-planned events such as constructions or special events lead to road capacity reductions and create bottlenecks in the traffic network. The traffic impact of such events goes beyond local areas, as informed drivers may detour to alternative corridors and consequently the traffic congestion may divert or propagate to other corridors. Due to the lack of real observation data, traditional traffic impact analyses are typically based on simulation models, fixed-location sensor data or survey questionnaires. In this research, we use high-resolution vehicle trajectory data collected via a smartphone app, which is capable of keeping track of individual driver's behavior before and after road capacity reduction, to investigate travelers' behavioral responses to pre-planned events and the contribution factors. For this purpose, a functional data analysis (FDA) approach based clustering method is firstly proposed to cluster trajectory data and identify detour patterns, and two logistic and a least absolute shrinkage and selection operator (LASSO) regression models are used to explain drivers' detour behavior choice for each pattern with spatial and temporal features of interest. A case study based on a lane closure event on MoPac expressway in Austin, TX is used as an example in this research. The case study demonstrates that: 1) the freeway capacity reduction triggered heterologous behavior responses, 2) driver detour behavior exhibits three major patterns, and 3) each detour pattern highly depends on spatial features such as trip length, distance to freeway entrance and distance to other alternative freeways, in addition to the temporal features when the trip happens.
key_numbers:
  - { value: "1,543 → 306", label: "app trips through the closure site before vs. after the lane closure" }
  - { value: "+27%", label: "average travel time for drivers who stayed on MoPac (5.7 min per trip)" }
  - { value: "12.8%", label: "how much the app underestimated travel time on MoPac, vs. 8% on detours" }
  - { value: "3", label: "distinct detour patterns found in the GPS traces" }
updated: 2026-10-27
---

## What problem does this research solve?

<blockquote class="pull-quote">
  <p>Highway agencies close lanes all the time for construction and maintenance, and they plan big events that do the same. Each closure creates a bottleneck. <strong>But the effect does not stay at the bottleneck: drivers who know about it start looking for other routes, and the congestion can move onto streets and freeways that were never part of the work zone plan.</strong></p>
</blockquote>

To plan for that, an agency needs to know **who changes route, where they go, and why**. That has been hard to answer. Traffic simulation models can predict network-wide effects, but only under assumptions about how drivers will react. Loop detectors and other fixed sensors measure how much traffic changes at their locations, but they cannot follow a person, so they cannot say which drivers detoured or why. Surveys ask drivers directly, but they rely on what people remember and report, and many people do not answer.

What was missing was **real, observed behavior of individual drivers, before and after the same closure**.

## What did we do?

We used trip data from **Metropia**, a smartphone navigation app. When a user starts a trip in the app, the phone records the vehicle's position and speed **every second** and sends it to a server, along with the route the app suggested and the travel time it predicted. Because each record carries a user ID, the same driver can be followed over many weeks.

<figure>
  <img src="/media/hu-capacity-reduction-gps-jits-2019/trajectory-example.jpg" alt="Satellite view of a city grid with three trips drawn as chains of colored dots, one green running north along a freeway, then yellow and orange segments turning east along arterial streets" loading="lazy" />
  <figcaption>What the app records: each dot is one GPS point, logged every second. This example is from Tucson, Arizona; the case study below is in Austin. Image: from the paper.</figcaption>
</figure>

The case study is a lane closure on the **MoPac Expressway (Loop 1)**, one of the key north-south freeways through Austin, Texas. Starting **February 21, 2016**, northbound MoPac was cut from **three lanes to two** between Lady Bird Lake and Enfield Road, just west of downtown.

<figure>
  <img src="/media/hu-capacity-reduction-gps-jits-2019/mopac-study-area.jpg" alt="Street map of central Austin with MoPac running north-south on the west side of downtown and I-35 on the east side. Two white arrows point at a short black arrow on MoPac just north of the river, marking the lane closure. Other routes labeled include 360, 183 and 290" loading="lazy" />
  <figcaption>The study area. The arrows mark the northbound MoPac lane closure just north of Lady Bird Lake. Drivers could avoid it on local arterials such as Lamar Boulevard, on other freeways such as I-35, 360 and 183, or by using different MoPac ramps. Image: from the paper.</figcaption>
</figure>

Before the closure, the app recorded **1,543 trips by 261 users** through the closure site; after it began, only **306 trips by 98 users**. Another **15,365 trips by 514 users** went the same direction but never used MoPac, before or after.

To compare like with like, we matched each trip after the closure with a trip before it by the **same user**, on the **same day of the week**, departing **within an hour** of the same time, with origin and destination each **within a quarter mile**. This gave **539 matched trip pairs** in which drivers kept going through the work zone, plus the detoured trips, whose routes we then grouped into patterns.

## What is the key methodological contribution?

GPS traces are hard to compare. One trip has 3,000 points, another 300; one phone logs every second, another every two. Standard statistical methods need every record to have the same set of variables, and a trajectory does not.

We used **functional data analysis (FDA)**, which treats each trip not as a list of points but as **a smooth curve over time**: one curve for longitude, one for latitude. Each curve is built from a small, fixed set of smooth building blocks called **B-splines**, and a least-squares fit finds how much of each building block the trip needs. In our example, about **3,000 GPS points are summarized by 20 numbers per curve**, with little loss of shape and with GPS jitter smoothed out.

<figure>
  <img src="/media/hu-capacity-reduction-gps-jits-2019/bspline-basis.png" alt="Chart of latitude against standard time from 0 to 100. Red diamonds are GPS points rising from about 30.26 to 30.30. A smooth black curve runs through them, and below it dashed bell-shaped curves show the individual B-spline building blocks" loading="lazy" />
  <figcaption>A trip's latitude over time. Red diamonds: raw GPS points. Dashed curves: the B-spline building blocks. Black curve: their weighted sum, the smooth trajectory. The weights are what the trip becomes in the analysis. Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/hu-capacity-reduction-gps-jits-2019/trajectory-as-curves.png" alt="Two stacked charts against standard time from 0 to 100: longitude rising steadily from about -97.77 to -97.74, and latitude rising in an S shape from about 30.26 to 30.29. Black dots are GPS points and a thin red line traces them closely" loading="lazy" />
  <figcaption>The same trip as two curves, longitude (top) and latitude (bottom), with time rescaled so trips of different length line up. The red B-spline curves follow the raw points (black) closely. Image: from the paper.</figcaption>
</figure>

Once every trip is the same short list of numbers, trips can be compared and grouped directly. We used a **Gaussian mixture model** to cluster the detoured trips by their curve coefficients, which revealed the three detour patterns at the top of this page.

To explain **why** a driver chose a given pattern, we described each trip by four location features and four time features:

- **Location**: trip length; distance from the origin and destination to the closure; distance from the origin and destination to the nearest alternative freeway; and the shortest distance from the closure to either end of the trip.
- **Time**: actual travel time; the travel time the app predicted before the trip; weekend or weekday; peak or off-peak hours.

We fit two logistic regression models (did the driver detour or not, and which pattern), then a **LASSO** multinomial model. LASSO shrinks weak or overlapping factors to zero, which matters here because actual and predicted travel times move together, and it leaves a short list of the factors that really separate the patterns.

## What are the key findings?

**The closure cost almost everyone time, including those who detoured.** For the 539 matched pairs, travel time rose by **5.7 minutes per trip on average, or 27%**, and **79% of trips (428 of 539)** took longer than before. Drivers who detoured fared no better: their trips took **7.0 minutes (31%) longer** than before. Leaving MoPac, on average, did not save time.

**So why detour? Reliability is a likely reason.** The app's travel time predictions were further off on MoPac during the closure than on the detour routes.

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col"></th><th scope="col" class="num">Stayed on MoPac</th><th scope="col" class="num">Detoured</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Extra travel time compared with before the closure</th><td class="num">5.7 min (+27%)</td><td class="num">7.0 min (+31%)</td></tr>
        <tr><th scope="row">How much the app underestimated the actual travel time</th><td class="num">12.8%</td><td class="num">8%</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Outcomes for drivers who stayed and drivers who detoured. Detouring was slower, but traffic on the detour routes was more predictable, which may make a slightly longer trip worth it.</figcaption>
</figure>

**Detours fall into three patterns**, shown in the maps at the top of this page:

1. **Avoid the freeway.** Mostly short trips, for example from south of the river to downtown or to areas between MoPac and I-35, that took a local arterial such as Lamar Boulevard around the work zone.
2. **Use another freeway.** Mostly long trips that switched to 360, I-35, 183 or 130. Longer trips simply have more freeway options.
3. **Start or end downtown.** Trips with one end near downtown that stayed on MoPac for part of the way but left it before the closure or joined it after, with some using I-35 or other corridors.

**Where a trip starts and ends matters more than when it happens.** In the first logistic model (detour or not), all four location features were significant, as were actual and predicted travel time; weekend and peak-hour flags mattered less. The final LASSO model kept only a few factors per pattern:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Factor kept by LASSO</th><th scope="col" class="num">1 Avoid freeway</th><th scope="col" class="num">2 Other freeway</th><th scope="col" class="num">3 Downtown trip</th></tr>
      </thead>
      <tbody>
        <tr class="is-highlight"><th scope="row">Trip length<span>log of distance</span></th><td class="num">−4.00</td><td class="num">+0.09</td><td class="num">−0.09</td></tr>
        <tr><th scope="row">Distance from origin and destination to other freeways<span>log of distance</span></th><td class="num">−0.04</td><td class="num">+0.04</td><td class="num">−0.04</td></tr>
        <tr class="is-highlight"><th scope="row">Shortest distance from the closure to either end of the trip<span>log of distance</span></th><td class="num">·</td><td class="num">·</td><td class="num">−0.56</td></tr>
        <tr><th scope="row">Actual travel time</th><td class="num">·</td><td class="num">+0.03</td><td class="num">·</td></tr>
        <tr><th scope="row">Travel time predicted by the app</th><td class="num">·</td><td class="num">−0.03</td><td class="num">·</td></tr>
        <tr><th scope="row">Weekend trip</th><td class="num">·</td><td class="num">·</td><td class="num">+0.13</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Coefficients of the final LASSO model, from Table 2 of the paper. A plus sign makes the pattern more likely, a minus sign less likely; a dot means LASSO dropped the factor. Two factors, the combined distance from the closure to both trip ends and the peak-hour flag, were dropped for all three patterns. The factors are on different scales, so compare signs across rows, not sizes.</figcaption>
</figure>

- **Pattern 1 is almost entirely about trip length.** The shorter the trip, the more likely the driver avoided the freeway altogether. Longer trips depend on the freeway network.
- **Pattern 2 is about longer trips and time.** Drivers who switched freeways tended to have longer trips, longer actual travel times and shorter predicted times on the new route: in effect, they were offered a faster-looking option and took it.
- **Pattern 3 is about closeness to the work zone.** The closer a trip's origin or destination was to the closure, the more likely the driver simply used a different MoPac ramp. This pattern was also more common on weekends, when lighter traffic makes city streets a good short bypass.

## What can this be used for?

- **Work zone and lane closure planning.** Agencies can expect three different spillovers, not one: short trips onto parallel arterials, long trips onto other freeways, and local trips onto the ramps and streets nearest the closure. Each points to different places to check signal timing, ramp capacity and detour signing.
- **Traveler information.** Drivers appeared willing to accept a longer but more predictable trip. Accurate, honest travel time estimates on a work zone corridor can help keep drivers from leaving it unnecessarily, or help steer them when the corridor really is unreliable.
- **A new data source for impact studies.** Navigation app data can follow the same driver before and after an event, which neither loop detectors nor surveys can do. The approach applies to other planned events such as bridge closures, special events and major reconstruction.
- **Trajectory analysis in general.** The functional data approach puts GPS traces of any length and sampling rate on a common footing, so they can be clustered and compared, for any study that needs to group routes or trips.
</content>
</invoke>
