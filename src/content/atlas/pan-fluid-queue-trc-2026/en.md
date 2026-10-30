---
tldr: >-
  We built a queue model in which the number of cars a jammed freeway bottleneck lets through rises
  and falls with the queue, as traffic flow theory says it should. On Los Angeles I-405 and Phoenix
  I-10 data it cut throughput estimation error by about a third compared with the usual
  constant-rate queue models, and it shows that managing demand and supply together lets a
  bottleneck serve more traffic.
hero:
  image: /media/pan-fluid-queue-trc-2026/constant-vs-dynamic-throughput.png
  alt: Two pairs of diagrams. Left, the classic model, where the bottleneck's output is a flat red line under a hump-shaped blue arrival curve. Right, this paper's model, where the red output curve sags during the jam and recovers to capacity at the end.
  caption: >-
    Left: classic queue models assume a jammed bottleneck discharges cars at a constant rate (flat
    red line). Right: in our model the discharge rate sags as the queue grows and recovers as it
    clears, which changes how fast the queue builds (yellow) and drains (green).
  credit: Pan, Hu & Zhou (2026)
teaser:
  image: /media/pan-fluid-queue-trc-2026/lead-teaser.png
  alt: >-
    Two side-by-side charts of flow rate over time. Left, the classic queue model: when arrivals rise
    above capacity, the bottleneck discharges at a flat rate, so the queue builds (yellow) and then
    drains (green). Right, our model: the discharge rate sags below capacity during the jam and
    recovers as the queue clears, so the queue drains more slowly.
affiliations:
  - The Pennsylvania State University
  - Arizona State University
author_affiliations: [[1], [1], [2]]
abstract: |-
  The efficient operation of transportation systems is a critical priority for policymakers, particularly given the increasingly emphasis on efficiency gains to meet growing travel demands without relying solely on capacity expansion. During peak hours at freeway bottleneck locations, a flow drop may be observed, and this drop is influenced by traffic stream attributes such as merging and diverging vehicles, resulting in significant efficiency losses. However, queue-based models, widely used for estimating delays and queue lengths, often oversimplify congestion dynamics by assuming a constant outflow rate, leading to inconsistencies when compared with FD-based observations of over-congested states. In this manuscript, we introduce a novel Fundamental Diagram-Consistent Fluid Queue (FDQ) framework for analyzing and mitigating traffic efficiency losses during heavy congestion. We extend the traditional fluid queue model by incorporating a stationary density-flow relationship observed empirically at key bottlenecks. Unlike classical queue-based models, our framework allows the flow throughput to evolve with local traffic state transitions, especially the shift from semi-congested to fully congested regimes. We start with triangular FD and show how to analytically derive FD-consistent dynamic flow throughput, as well as the associated traffic states such as the queue profile and waiting time. Such framework is then utilized to understand efficiency loss mechanisms and explore the potential for increased system efficiency through targeted inflow control. Two types of FDQ models were developed: one with flow throughput in polynomial form (FDQ-PN) and another in piecewise form (FDQ-PW). The FDQ framework is also extended to work with quadratic FD. Validation and numerical analyses were performed using datasets from Los Angeles I-405 and Phoenix I-10. The results demonstrate that the proposed framework substantially improves the accuracy of traffic state estimation. Furthermore, the demand-supply coupled inflow control is shown to offer a more significant efficiency gain than adjusting demand or supply alone.
key_numbers:
  - { value: "35.6%", label: "lower throughput error (RMSE) than constant-rate queue models on I-405 Los Angeles; 33.8% on I-10 Phoenix" }
  - { value: "8 h", label: "of over-congestion at the I-405 bottleneck on the study day, from 12:20 to 20:20" }
  - { value: "5.3–9.9%", label: "throughput error (MAPE) across ten weekdays of cross-day tests" }
  - { value: "+25%", label: "more traffic discharged at the low point of the jam when demand and supply are managed together, for the same 30% cut in queue and delay" }
featured: true
updated: 2026-10-26
---

## What problem does this research solve?

Freeway bottlenecks, such as the merge just past a busy on-ramp, are where most peak-hour delay is born. Traffic engineers estimate how long the queue there will get and how much delay it causes with **queue models**: cars arrive at some rate, the bottleneck lets them out at another, and the difference piles up as a queue. These models are simple, fast and widely used in planning and operations.

They share one assumption, though: once a bottleneck is jammed, it keeps discharging cars at a **constant rate**. Field data say otherwise. When the queue is long and traffic is stop-and-go, merging and lane changing get messier and *fewer* cars make it through per hour. Traffic engineers call this a flow drop or capacity drop. It is the textbook shape of the **fundamental diagram**, the curve linking how many cars are on the road (density) to how many pass a point (flow): beyond a critical density, more cars on the road means less flow, not more.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/i405-speed-heatmap.png" alt="Heat map of speed by time of day for detectors 3 to 14 on I-405; a large dark red block of low speeds runs from about 13:00 to 19:30 across most detectors" loading="lazy" />
  <figcaption>Speeds along the study section of Los Angeles I-405, detector by detector, on the study day. Dark red means slow traffic: the jam starts around midday and lasts into the evening. Detector 3 at the top, just downstream of the bottleneck, stays free-flowing, which confirms the bottleneck is real and not caused by traffic further ahead. From the paper.</figcaption>
</figure>

We checked this at a recurring bottleneck on I-405 near Brookhurst Street, using Caltrans PeMS loop-detector data. During the eight hours of over-congestion (12:20 to 20:20), flow at the bottleneck first broke down and then recovered, while density rose and then fell. A flat discharge line cannot follow that pattern.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/i405-flow-breakdown.png" alt="Three charts from the I-405 bottleneck: a flow versus density scatter where red over-congested points fall as density rises; flow and density over the day; and observed throughput during the jam fitted by a flat green line and a U-shaped red curve" loading="lazy" />
  <figcaption>What the I-405 detector saw. Left: past the critical density, flow falls as the road fills up (red). Middle: during the over-congested period, flow (solid) breaks down and recovers while density (dotted) rises and falls. Right: a curve that lets throughput change (red) follows the data much better than the constant rate queue models assume (green). Over 81 days of data, the changing curve's average error (RMSE) was 105.85 against 167.15 for the flat line. From the paper.</figcaption>
</figure>

If the model gets the discharge rate wrong, it also gets the queue length, the delay and the benefit of any congestion strategy wrong. That matters to agencies asked to squeeze more efficiency out of existing roads instead of building new capacity.

## What did we do?

We built the **Fundamental Diagram-Consistent Fluid Queue (FDQ)** model. It keeps the simplicity of a classic "fluid" queue model, where traffic is treated as a continuous flow and everything has a closed-form formula, but replaces the constant discharge rate with one that obeys the fundamental diagram.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/triangular-fundamental-diagram.png" alt="A triangular fundamental diagram: flow rises in a straight line to capacity at the critical density, then falls in a straight line to zero at the jam density; a dotted line marks a lower flow mu of t at a higher density k of t" loading="lazy" />
  <figcaption>The triangular fundamental diagram. Once density k(t) passes the critical density, the flow that can get out, μ(t), slides down the red line below capacity. The FDQ model ties that slide to the length of the queue. From the paper.</figcaption>
</figure>

The idea fits in one line: **the longer the queue, the lower the bottleneck's output.** We link queue length to the extra density above the critical value, and through the fundamental diagram to throughput, so that throughput equals capacity minus a constant times the queue. From that rule we derived, in closed form, how arrivals, departures, queue length, waiting time and total delay evolve over a congestion episode.

We developed two versions:

- **FDQ-PN**, with arrival and departure rates as smooth polynomial (cubic) curves, extending Newell's classic fluid queue model;
- **FDQ-PW**, a simpler piecewise-linear version.

We also extended the framework from the triangular fundamental diagram to a curved (quadratic) one, showing the approach does not depend on one particular diagram shape.

We tested both versions on two real bottlenecks: **Los Angeles I-405** (PeMS loop detectors, 5-minute data) and **Phoenix I-10** (microwave sensors, 5-minute data, congested from 14:10 to 19:10), against two benchmark queue models that assume a constant discharge rate.

## What is the key methodological contribution?

Earlier fluid queue models made the *arrival* side realistic, with curved demand profiles, but kept the *departure* side flat. The FDQ model makes both sides dynamic and ties them together through the fundamental diagram. Three results follow from the math:

1. **Throughput always stays physically sensible.** The discharge rate never exceeds bottleneck capacity and declines steadily as congestion deepens, exactly as the fundamental diagram's congested branch says.
2. **Everything stays in closed form.** When arrivals and departures are cubic curves, their leading terms must be equal, the difference between them (the net flow) is a simple quadratic, and the queue is a cubic. Queue length, cumulative counts, waiting time and total delay all come out as formulas, with no simulation required.
3. **The jam's size scales in a predictable way.** The congestion duration, the longest queue and the total delay grow with the peak excess of arrivals over discharge, to the powers 1/2, 3/2 and 2. Holding the shape of the curves fixed, doubling that peak excess makes the longest queue nearly three times as long and the total delay four times as large.

Because inflow and outflow are linked, any change in one changes the other. That is what makes it possible to ask a new question: **if we adjust the inflow, how much more can the bottleneck discharge?**

## What are the key findings?

**More accurate traffic states.** Fitting the observed bottleneck throughput, the FDQ models clearly beat the constant-rate benchmarks:

- On I-405, FDQ-PN cut throughput error by **35.6% (RMSE)** and **46.2% (MAPE)**; on I-10, by **33.8%** and **47.6%**.
- Throughput error (MAPE) fell from about 20% with the benchmark models to **10.9%** on I-405 and **10.6%** on I-10.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/throughput-fit-la.png" alt="Three charts of observed throughput at the I-405 bottleneck from noon to 20:30, with green dots dipping from about 1,600 to about 800 vehicles per hour per lane and back; fitted by a flat line, a V-shaped line, and a smooth U-shaped curve" loading="lazy" />
  <figcaption>Fitting the I-405 bottleneck's throughput three ways. Left: a constant rate misses the dip completely. Middle: a piecewise-linear rate (FDQ-PW) follows it. Right: the smooth polynomial rate (FDQ-PN) fits best. From the paper.</figcaption>
</figure>

- The FDQ models also reconstructed the **queue profile** better, with the piecewise version giving the lowest queue error on both freeways.
- Estimated **travel times** matched observations with R² of **0.92** on I-405 and **0.87** on I-10.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/queue-fit-la.png" alt="Two charts of observed queue length at the I-405 bottleneck from noon to 20:30, rising to about 60 vehicles per lane around 18:00 and falling; fitted by a triangle-shaped line and by a smooth hump-shaped curve" loading="lazy" />
  <figcaption>Queue length at the I-405 bottleneck, observed (dots) and estimated (red), with the piecewise FDQ-PW (left) and polynomial FDQ-PN (right) models. Both capture the slow build-up and faster clearance. From the paper.</figcaption>
</figure>

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/travel-time-fit.png" alt="Two charts of travel time over the day in 5-minute intervals, for Los Angeles and Phoenix; observed blue dots rise from about 50 seconds to 350 to 500 seconds during the jam, and the red model curve follows the rise and fall" loading="lazy" />
  <figcaption>Observed (blue) and estimated (red) travel times through the bottleneck over the whole day, Los Angeles (left) and Phoenix (right). From the paper.</figcaption>
</figure>

**Stable from day to day.** Calibrated on eight weekdays at the same I-405 bottleneck and checked on two more, the model kept fundamental-diagram error at **3.6–5.7%** and throughput error at **5.3–9.9%** (MAPE), even though the start and end of the jam shifted by one to three hours from day to day.

**Managing demand and supply together pays off most.** We compared three ways of shrinking the bottleneck's net flow, the excess of arrivals over discharge:

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/control-strategies.png" alt="Three flow-rate diagrams. Left: the arrival curve is lowered while discharge is fixed. Middle: the discharge curve is raised while arrivals are fixed. Right: both curves are adjusted together." loading="lazy" />
  <figcaption>Three ways to shrink the gap between arrivals λ(t) and discharge μ(t). Left: demand side, for example reservations or pricing that lower arrivals. Middle: supply side, for example ramp metering or smoother merging that raise discharge. Right: both together. From the paper.</figcaption>
</figure>

- Cutting net flow by 30% on I-405 shortened the longest queue from **53 to 37 vehicles** and total delay from **233 to 163 hours** under all three strategies.
- But only the coupled strategy also raised the bottleneck's output. At its worst point in the jam, the bottleneck discharged **1,138 instead of 907 veh/h/lane (+25%)** while accepting 1,145 instead of 916 arrivals. Demand-only or supply-only control changed these by less than 0.4%.

In other words, **reducing the queue does not have to mean turning drivers away.** Managed well, the same bottleneck can carry more traffic and still have shorter queues and less delay.

## What can this be used for?

- **Traffic management centers and DOTs**: a fast, transparent way to estimate queue length, delay and travel time at recurring freeway bottlenecks from ordinary loop-detector or probe data, and to compare ramp metering, variable speed limits, reservations or cooperative merging before deploying them.
- **Active Traffic and Demand Management (ATDM)**: the model's time-varying arrival and discharge curves can feed predictive or rule-based controllers that coordinate demand and supply.
- **Modelers and planners**: FDQ curves can replace constant-capacity or BPR-type link performance functions in dynamic traffic assignment, and can be passed to simulators such as VISSIM, SUMO or a cell transmission model as demand and capacity inputs.
- **Connected and automated vehicles**: smoother CAV arrivals and cooperative merging map directly onto the model's arrival and discharge curves, so FDQ offers a physics-consistent way to evaluate CAV-based congestion relief.

<figure>
  <img src="/media/pan-fluid-queue-trc-2026/fdq-workflow.png" alt="Flowchart: input traffic data feed FDQ calibration and parameter estimation, which produce dynamic arrival and departure profiles; these connect to microscopic or mesoscopic simulators and to phase-based dynamic traffic assignment, ending in queue, delay and efficiency assessment" loading="lazy" />
  <figcaption>From detector data to decisions: how the FDQ model is calibrated and how its arrival and discharge curves plug into simulation and dynamic traffic assignment tools. The simulator links are shown as a conceptual pathway; full simulation-based validation is future work. From the paper.</figcaption>
</figure>

The current model covers a single, fixed bottleneck. Next steps include multiple interacting bottlenecks, signalized arterials, random fluctuations in traffic, and the effects of weather and incidents on throughput.
