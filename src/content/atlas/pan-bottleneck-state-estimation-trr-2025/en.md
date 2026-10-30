---
tldr: >-
  When a bottleneck jams, road sensors count fewer cars, not more, so the standard planning formula
  thinks traffic is getting lighter. We estimate the demand hidden in the queue from traffic density
  and plug it into a revised travel-time function; on Beijing and Los Angeles corridors this cut
  travel time error to about 4–5%, and on I-405 more than halved it compared with the usual
  mirror-image method.
hero:
  image: /media/pan-bottleneck-state-estimation-trr-2025/observed-flow-vs-demand.png
  alt: A speed curve drawn against flow. On the left, a yellow congested branch where observed flow is below capacity; on the right, a red branch labeled derived demand, beyond capacity. A dashed line links an observed point on the left to an estimated point on the right.
  caption: >-
    In a jam, a detector sees low speed and low flow (yellow branch, left). The cars that want to get
    through are still there, waiting in the queue. We map each congested observation to the demand
    behind it (red branch, right), beyond the road's capacity.
  credit: Pan et al. (2025)
affiliations:
  - The Pennsylvania State University
  - Old Dominion University
  - Beijing University of Technology
  - Arizona State University
author_affiliations: [[1], [1], [2], [3], [4]]
abstract: |-
  Accurate estimation of traffic state under oversaturated conditions is fundamental to a wide range of transportation applications. While intuitive, volume-to-capacity (q/q_c) ratio-based link performance functions are challenged by the U-shaped pattern of real-world speed-flow plots, which contradict the monotonic assumptions of link performance models such as the BPR function, particularly when q/q_c ≥ 1. This study addresses this critical gap by proposing an enhanced demand estimation method grounded in the Greenshields model, incorporating a real-time inflow correction factor to more accurately capture traffic demand at bottlenecks. In parallel, a modified link performance function is introduced, replacing the traditional volume-to-capacity ratio with a demand-to-capacity (D/q_c) ratio formulation. This enables a segmented travel time and speed estimation model capable of capturing nonlinear congestion dynamics under oversaturated conditions. The effectiveness of the proposed framework is evaluated using real-world traffic data collected from two highly congested urban corridors, namely West Third Ring Road in Beijing and I-405 in Los Angeles. Results show that the proposed method significantly outperforms both the symmetric method and the quasi-density model in terms of demand and travel time estimation accuracy. In the I-405 case, for example, the mean absolute percentage error (MAPE) in travel time estimation drops from 8.54% to 3.86%, while the coefficient of determination (R²) improves from 0.83 to 0.95. Comparative analysis further reveals that the Beijing corridor experiences higher demand, lower supply, and reduced discharge efficiency. These findings demonstrate the practical utility and robustness of the proposed method for real-world congestion diagnosis and urban mobility management.
key_numbers:
  - { value: "3.86%", label: "travel time error (MAPE) on Los Angeles I-405, down from 8.54% with the symmetric method" }
  - { value: "0.95", label: "R² of travel time estimates on both corridors, against 0.21 (Beijing) and 0.83 (Los Angeles) for the symmetric method" }
  - { value: "2.33", label: "average demand-to-capacity ratio in the Beijing jam, above the ceiling of 2 that the symmetric method allows" }
  - { value: "3,213", label: "vehicles per hour per lane trying to pass the Beijing bottleneck during the jam, against a capacity of 1,380" }
updated: 2026-10-27
---

## What problem does this research solve?

Planners estimate how long a trip on a road will take with a **link performance function**. The most widely used one, the Bureau of Public Roads (BPR) function, is built into most travel demand software. It works from a single ratio: the traffic volume counted on the road divided by the road's capacity (the volume-to-capacity, or v/c, ratio). The higher the ratio, the longer the travel time.

<blockquote class="pull-quote">
  <p>That works until a bottleneck jams. <strong>Once traffic breaks down, cars crawl, and a detector counts fewer cars per hour than it did just before the jam, not more.</strong> Plotted against speed, the counts trace a U shape: speed falls as volume rises toward capacity, then speed and volume fall <em>together</em> once the road is oversaturated. <strong>To the BPR function, a jammed road with low counts looks like a quiet road.</strong> The cars that want to get through are still there; they are waiting in the queue, where a detector cannot count them as flow.</p>
</blockquote>

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/demand-supply-equilibrium.png" alt="Three cost-versus-flow diagrams: a falling red demand curve, a rising blue supply curve, and the two combined, where an underestimated demand curve D1 meets supply at a lower point A instead of the true point B" loading="lazy" />
  <figcaption>Why hidden demand matters. Travel cost settles where demand (red) meets supply (blue). If the demand behind a jam is underestimated (curve D<sub>1</sub> instead of D<sub>2</sub>), the model lands on a false point A, with less traffic and a shorter travel time than the true point B. From the paper.</figcaption>
</figure>

Getting this demand right matters for long-range plans, for corridor and interchange design, and for day-to-day traffic management. If a model underestimates demand at a bottleneck, it underestimates delay and can steer money and attention to the wrong places.

## What did we do?

We built a two-part method and tested it on two of the most congested urban corridors we could find data for.

1. **Estimate the demand hidden in the queue.** In a jam, flow drops but **density** (cars per kilometer of lane) stays high, so density is a better clue to how many cars are waiting. We extend a classic traffic flow model, the Greenshields model, to turn density into an estimate of the latent demand at the bottleneck.
2. **Use that demand to estimate travel time.** We revise the BPR function so that, once a road is oversaturated, it runs on the **demand-to-capacity ratio (D/q<sub>c</sub>)** instead of the counted volume. The function is split in two: the classic form below capacity and a separately calibrated form above it, so travel time keeps rising as demand piles up.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/greenshields-diagram.png" alt="Three Greenshields fundamental diagrams: flow against density as a hump peaking at capacity, speed against flow as a sideways U, and speed falling in a straight line with density" loading="lazy" />
  <figcaption>The Greenshields model links flow, speed and density. Past the critical density k<sub>c</sub> (red, congested side), adding cars lowers flow. That falling side is where counts stop telling you the demand. From the paper.</figcaption>
</figure>

We tested the method with loop-detector data from two corridors:

- **West Third Ring Road, Beijing**: 14.8 km with seven interchanges and 21 ramps, 15 detectors, 2-minute data over 16 days in June 2021.
- **I-405, Los Angeles**: an 11 km stretch of the main route to LAX with 23 ramps, 22 detectors, 5-minute data over 75 days between April and July 2021.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/fundamental-diagram-fits.png" alt="Six scatter plots of detector data with dashed Greenshields curves. Top row Beijing: flow levels off near 1,100 to 1,250 vehicles per hour per lane while density keeps rising. Bottom row Los Angeles: flow peaks near 1,750 and then falls with density." loading="lazy" />
  <figcaption>Detector data at the bottleneck (red dots) and the fitted Greenshields model (dashed), for Beijing (top) and Los Angeles (bottom). The fits reach R² of 0.83 and 0.87. Notice the Beijing jam: flow stays flat around 1,100–1,250 vehicles per hour per lane while density keeps climbing. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

A common way to recover hidden demand is the **symmetric method**: take the congested side of the speed-flow curve and mirror it across capacity. If a detector counts q cars in a jam, the method sets demand to D = 2q<sub>c</sub> − q. It is simple, but it has a built-in ceiling: since q can't drop below zero, demand can never exceed **twice the capacity**. Severe peaks, special events or bad weather can push demand past that.

We add a correction term based on the slope of the Greenshields flow-density curve:

**D = 2q<sub>c</sub> − q + v<sub>f</sub> · (2k / k<sub>j</sub> − 1) · k**

where k is the observed density, k<sub>j</sub> the jam density and v<sub>f</sub> the free-flow speed. The term is about zero in light traffic and at the critical density, so it changes nothing there. As density approaches jam density, it grows quickly, adding the demand that the mirror image misses. With the correction, the demand-to-capacity ratio can go above 2.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/corrected-demand-curve.png" alt="Speed plotted against the demand-to-capacity ratio. A green curve for the symmetric method ends at a ratio of 2; a red curve for the corrected method continues past 2 at low speed." loading="lazy" />
  <figcaption>The symmetric method (green) stops at a demand-to-capacity ratio of 2. Our corrected estimate (red) keeps going, so it can describe jams where far more cars are waiting than the road can serve. From the paper.</figcaption>
</figure>

The second piece is the **piecewise travel-time function**: the classic BPR form t<sub>f</sub>[1 + α(q/q<sub>c</sub>)<sup>β</sup>] below capacity, and t<sub>f</sub>[1 + m(D/q<sub>c</sub>)<sup>n</sup>] above it, with each pair of parameters fitted to its own regime. A matching pair of formulas gives speed.

## What are the key findings?

**Travel time and speed estimates improved on both corridors.** We compared our method with the symmetric method and with a quasi-density method that uses the density ratio k/k<sub>c</sub>. All three use the same BPR-type function; they differ only in how they measure demand.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/travel-time-error.png" alt="Bar charts of travel time error for three methods. Beijing: symmetric 18.51 percent, quasi-density 5.91 percent, proposed 5.15 percent. Los Angeles: symmetric 8.54 percent, quasi-density 6.56 percent, proposed 3.86 percent." loading="lazy" />
  <figcaption>Travel time error in oversaturated conditions (lower is better), with R² in brackets. The symmetric method breaks down in Beijing, where demand often exceeds twice capacity. Our method has the lowest error on both corridors, and the gap is largest on I-405. Chart drawn from Table 9 of the paper.</figcaption>
</figure>

- **Travel time**: error fell to 5.15% in Beijing and 3.86% in Los Angeles, with R² of 0.95 on both. On I-405 the symmetric method's error was 8.54% (R² 0.83).
- **Speed**: error fell to 5.30% in Beijing (symmetric method 19.92%) and 4.05% in Los Angeles (symmetric method 8.28%), with R² of 0.96 on both.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/travel-time-fits.png" alt="Four scatter plots of observed travel time in orange with a blue fitted line. Left plots use the density ratio K over Kc; right plots use the demand-to-capacity ratio D over C, which reaches about 7 in the top row and about 3 in the bottom row." loading="lazy" />
  <figcaption>Observed travel times (orange) and fitted curves (blue) in oversaturated conditions, using the density ratio of the quasi-density method (left) and our demand-to-capacity ratio (right). Top: Beijing, where the ratio reaches about 7. Bottom: Los Angeles. From the paper's figures.</figcaption>
</figure>

**The two cities jam differently.** On average, congestion at the Beijing bottleneck lasted 4.3 hours (morning peak), and at the I-405 bottleneck 5.4 hours (afternoon to evening). Los Angeles jams last longer, but Beijing's are more severe: an average demand-to-capacity ratio of 2.33 against 1.63, and a travel time 3.34 times the free-flow time against 2.90.

<figure>
  <img src="/media/pan-bottleneck-state-estimation-trr-2025/beijing-vs-la.png" alt="Grouped bar chart. Demand during congestion: Beijing 3,213, Los Angeles 2,854. Capacity: Beijing 1,380, Los Angeles 1,750. Queue discharge rate: Beijing 1,123, Los Angeles 1,448. All in vehicles per hour per lane." loading="lazy" />
  <figcaption>Beijing has more demand, less capacity and a slower queue discharge than Los Angeles, which is why its jams are more severe. In both cities the queue discharges more slowly than the road's capacity. Chart drawn from Table 6 of the paper.</figcaption>
</figure>

- **Worst days**: in Beijing, the Monday morning peak, with a demand-to-capacity ratio of 2.88. On I-405, the Friday evening peak, with the longest jam (6.5 hours) and a ratio of 1.92.
- **A likely factor**: the two corridors look alike on paper (three mainline lanes, bus lanes, 21–23 ramps), but the West Third Ring links the job centers of Zhongguancun and Shangdi with large residential areas in Fengtai District, home to over two million people. This job-housing separation probably adds to Beijing's one-directional peak demand. The paper treats this as a description, not a proven cause.
- **Limits**: the Greenshields model assumes speed falls in a straight line with density, but in real jams speed often levels off. The paper treats the model as a first-order approximation; other fundamental diagrams (Van Aerde, S3) fit the data more closely and are a direction for future work.

## What can this be used for?

- **Planning models**: agencies using BPR-type functions in travel demand models can switch to the demand-to-capacity ratio in oversaturated conditions, so that jammed links are not mistaken for lightly used ones.
- **Bottleneck diagnosis**: the method turns ordinary loop-detector counts, speeds and densities into an estimate of how many cars want to use a bottleneck and for how long, which helps rank bottlenecks for improvements.
- **Operations and TSMO**: day-of-week demand profiles (for example, the Monday morning peak in Beijing or Friday evening on I-405) show when demand management or control would help most.
- **Comparing corridors**: demand, capacity and discharge rate together give a simple, comparable picture of how and why two corridors congest differently.
