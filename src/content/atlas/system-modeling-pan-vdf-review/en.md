---
tldr: >-
  We reviewed more than 270 studies on the volume-delay functions that turn traffic volume into
  travel time in planning models, laid out a physics-informed AI framework for the next generation,
  and showed on 81 weekdays of Los Angeles I-405 data that a physics-informed neural network cut the
  average travel-time error from 4.3 minutes (classic BPR curve) to 0.08 minutes.
hero:
  image: /media/system-modeling-pan-vdf-review/modeling-paradigms-cube-hero.png
  alt: A cube with axes for use of traffic theory, use of data and generalization; a physics model panel sits on the high-theory, low-data side, a machine learning panel on the high-data, low-theory side, and a red physics-informed neural network block spans the top
  caption: Three ways to model delay. Physics models rest on traffic theory but use little data; machine learning uses lots of data but little theory; physics-informed neural networks (PINNs) combine both. Redrawn from Fig. 10 of the paper.
  credit: Pan et al. (2025)
affiliations:
  - The Pennsylvania State University
  - North Carolina State University
  - Arizona State University
author_affiliations: [[1], [1], [2], [3]]
abstract: |-
  [Purposes] Link Performance Functions (LPFs) underpin the estimation of travel times, delays, and congestion in transportation network models. As multimodal systems become increasingly data-rich and feature Connected and Automated Vehicles (CAVs), Electric Vehicles (EVs), and complex queuing phenomena, traditional LPFs face limitations in accuracy, physical consistency, and real-time adaptability. This review synthesizes the evolution of LPFs to address these modern challenges and to bridge theoretical foundations, diverse data sources, and artificial intelligence (AI) techniques. [Methods] We conduct a systematic literature survey of over 270 peer-reviewed studies, covering (i) classical empirical forms (e.g., BPR, Davidson), (ii) theory-driven models (fundamental-diagram and fluid-queue approaches), and (iii) AI-augmented frameworks (LSTM, GNN, Transformer, and physics-informed learning). Models are classified by their mathematical assumptions, data requirements, integration with Dynamic Traffic Assignment tools, and support for multimodal flow interactions. We further evaluate each class against emerging criteria: queuing dynamics, CAV/EV impacts, data fusion complexity, and computational tractability, with the following [Highlights]: (1) emergence of hybrid physics-machine learning (ML) models that enforce conservation laws while leveraging large-scale probe and sensor data; (2) critical gaps in AI-related methods evaluation: reliance on point-error metrics rather than system-level Key Performance Indicators (KPIs) (e.g., network delay, throughput, queue length, bottleneck durations). By bridging theory, data, and AI, this review maps the current landscape of LPFs, highlights open research directions (e.g., fully differentiable LPFs, uncertainty quantification, real-time adaptation), and provides a roadmap for developing robust, transparent models suited to next-generation multimodal transportation networks. (3) Physics-Informed Neural Networks (PINNs) achieve superior predictive accuracy in travel time estimation while maintaining physical consistency, demonstrating clear advantages over both traditional LPFs and other data-driven approaches.
key_numbers:
  - { value: "270+", label: "peer-reviewed studies reviewed, from the 1950s to today" }
  - { value: "81", label: "weekdays of I-405 loop-detector data in the head-to-head model test" }
  - { value: "0.077 min", label: "average travel-time error of the physics-informed model, against 4.335 min for the classic BPR curve" }
  - { value: "9", label: "priority research questions in a short-, medium- and long-term roadmap" }
updated: 2026-10-25
---

## What problem does this research solve?

Every regional travel model used by a state DOT or metropolitan planning organization ends the same way: it loads the region's trips onto the road network and asks, for each road segment, *how long will it take to drive this if this many cars use it?* The formula that answers that question is called a **volume-delay function (VDF)**, also known as a link performance function. It sits at the heart of traffic assignment, and through it, of decisions about new lanes, tolls, transit investments and the impact of new technology.

The most common VDF is still the **BPR curve** from the U.S. Bureau of Public Roads' 1964 traffic assignment manual. It is simple: travel time grows with the ratio of traffic volume to road capacity (V/C). That simplicity is also its weakness. When a road is jammed, the number of cars that actually get through goes *down*, not up. A detector at a bottleneck counts the queue's discharge, not the true number of drivers who wanted to use the road, so a jammed road and a lightly used road can show the same measured volume. A curve driven by measured V/C cannot tell them apart, and it says nothing about how long the jam lasts.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/speed-demand-regimes.png" alt="Speed plotted against demand over capacity, with three regions: A uncongested, B congested and C oversaturated; an observed flow in region B is mirrored to an estimated demand in region C" loading="lazy" />
  <figcaption>Why measured volume misleads. In region A (uncongested) speed falls gently as traffic grows. Past capacity, a detector sees only the queue's discharge rate (observed μ, region B). The true demand (estimated D, region C) is beyond what any detector can count and has to be inferred. From the paper.</figcaption>
</figure>

At the same time, AI models such as LSTMs, graph neural networks and Transformers have become very good at forecasting traffic speeds from sensor data. But they are trained only to match past observations. They can predict vehicles appearing from nowhere, negative delays, or flows above capacity, they are hard to interpret, and they may fail when conditions change, which is exactly when planners need them. Planners are left choosing between transparent curves that are often wrong under congestion and accurate black boxes they cannot fully trust.

## What did we do?

We carried out a systematic review of more than **270 peer-reviewed studies** from over 50 transportation journals, found through Web of Science, Scopus, TRID and IEEE Xplore. Each study was coded by its theoretical foundation (fundamental diagram, queueing, simulation or data-driven), time scope (static to fully dynamic), spatial scale (link to network) and application (freeways, urban streets, multimodal, emerging mobility).

<figure>
  <img src="/media/system-modeling-pan-vdf-review/publication-trend.png" alt="Bar chart of the number of reviewed publications per five-year period, rising from 5 before 1975 to 72 since 2020" loading="lazy" />
  <figcaption>Publications on volume-delay functions in the review, by period. Interest has grown sharply since 2010, with 72 of the reviewed studies published since 2020. From the paper.</figcaption>
</figure>

The review traces how VDFs evolved: from 1950s straight-line and two-segment formulas, through exponential and logarithmic curves in the 1960s, the BPR function in 1964, and later conical and time-dependent forms (Spiess, Akçelik), to queue-based functions and today's AI and physics-informed approaches. It also covers versions built for trucks, buses, HOV lanes and rail. One telling detail: about 3,184 papers use "the BPR function", but only about 284 cite the original 1964 manual.

Finally, we tested seven representative models side by side on the same real freeway data, using open code and data.

## Three misconceptions about volume-delay functions

Drawing on the full review, the paper names three persistent misconceptions about VDFs and explains why each one is misleading and what to do instead.

<ol class="myths">
  <li class="myth">
    <span class="myth-label">Misconception 1</span>
    <p class="myth-claim">“VDFs only belong in regional, static traffic assignment.”</p>
    <p class="myth-reality"><strong>In fact,</strong> VDFs rest on the same fundamental-diagram and queueing principles that govern traffic from single vehicles to whole networks. They are often calibrated once from annual or peak-hour counts, but when they are calibrated across uncongested, congested and oversaturated conditions, one function can infer the true demand behind a jam and support regional, multimodal analysis of delay, safety and queuing, not just the cost of an isolated corridor.</p>
  </li>
  <li class="myth">
    <span class="myth-label">Misconception 2</span>
    <p class="myth-claim">“Only high-fidelity simulation can model congestion.”</p>
    <p class="myth-reality"><strong>In fact,</strong> microsimulation and dynamic assignment capture queues and spillback, but they are expensive to run and say little about the marginal cost of one more vehicle. An analytical VDF extended into the oversaturated regime reproduces the key measures (throughput, delay and congestion duration) at a fraction of the cost. The paper recommends a hybrid: use the VDF for calibration against these measures, and targeted simulation for local checks.</p>
  </li>
  <li class="myth">
    <span class="myth-label">Misconception 3</span>
    <p class="myth-claim">“Black-box AI models make VDFs unnecessary.”</p>
    <p class="myth-reality"><strong>In fact,</strong> LSTM, graph-network and Transformer forecasters do well in free-flowing traffic, but they typically ignore queue spillback and the demand that detectors cannot see. A model trained only on uncongested conditions underperforms once capacity is exceeded. Machine learning adds the most when it works inside a VDF framework: fitting the fundamental diagram, estimating traffic states and updating the curve's parameters in real time, which yields demand, capacity and corridor-level insights a standalone forecast cannot.</p>
  </li>
</ol>

## What is the key methodological contribution?

Beyond summarizing the literature, the paper sets out four practical insights and a unified framework.

**1. Calibrate with true demand, not measured flow.** Using cumulative arrival and departure counts, modelers can estimate the demand that built up behind a bottleneck and use the **demand-to-capacity ratio (D/C)** instead of V/C. Even "capacity" needs care: the paper lays out six distinct flow rates observed around a single breakdown.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/bottleneck-capacity-states.png" alt="Two panels of 5-minute freeway data: flow and speed over a day, and flow against speed, with six labeled states A to F from free flow through breakdown, queue discharge and recovery" loading="lazy" />
  <figcaption>Six flow rates at one I-405 bottleneck on July 5, 2017: free flow (A), before breakdown (B), maximum pre-breakdown flow (C), breakdown (D), lowest queue discharge (E) and recovery (F). Which one counts as "capacity" changes the answer a VDF gives. From the paper.</figcaption>
</figure>

**2. Link time-varying queues to average delay.** Fluid-queue models such as Newell's give closed-form travel times as a queue grows and clears, which ties the curve planners use back to the physics of the bottleneck.

**3. Treat congestion duration as a primary driver of delay.** How long demand stays above capacity explains much more of the delay than the busiest 15 minutes alone, so the paper recommends making congestion duration a core measure in VDF calibration.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/congestion-duration.png" alt="Inflow demand over a morning from 6:00 to 10:00, marking the busiest 15 minutes, the peak hour from 7:00 to 8:00, and a longer congestion period from 6:45 to 8:25" loading="lazy" />
  <figcaption>The busiest 15 minutes, the peak hour and the congestion duration are different windows. The usual peak-hour factor captures the first two; the congestion duration, from breakdown (D) to recovery (F), is what drives the delay. From the paper.</figcaption>
</figure>

**4. Connect vehicle behavior to network delay.** For connected and automated vehicles, shorter reaction times and gaps at the vehicle level raise road capacity, which shortens congestion. In the paper's illustration, cutting reaction time from 1.5 s to 1 s and the minimum gap from 7 m to 5 m raises capacity from 1,800 to 2,160 vehicles per hour per lane and shortens a congestion period from about 3.0 to 2.5 hours.

Building on these insights, the paper proposes an **end-to-end, physics-informed AI pipeline** for VDFs. Neural networks (graph networks, Transformers and attention) estimate link capacity from road attributes and outside factors such as weather and incidents, and the predicted travel times are fed back to refine capacity. The training is constrained by traffic physics: vehicles are conserved, queues equal arrivals minus departures and never go negative, flow and density follow a fundamental diagram, and delays never go negative.

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Model</th><th scope="col">Accuracy</th><th scope="col">Physical consistency</th><th scope="col">Interpretability</th><th scope="col">Trade-off</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">BPR curve<span>Empirical</span></th><td>Low; inaccurate under oversaturation</td><td>Low; relies only on V/C</td><td>Medium</td><td>Simple and widely used in planning</td></tr>
        <tr><th scope="row">Fundamental diagram (Greenshields)<span>Theory-driven</span></th><td>Medium</td><td>High</td><td>High; parameters have clear physical meaning</td><td>Good for capacity estimation and telling traffic states apart</td></tr>
        <tr><th scope="row">Fluid queue (Newell)<span>Theory-driven</span></th><td>High for oversaturated travel time</td><td>Very high; models queues, discharge rate and congestion duration</td><td>High</td><td>Treats congestion duration as the main driver of delay</td></tr>
        <tr><th scope="row">LSTM<span>Data-driven</span></th><td>High in the short term</td><td>Medium; no explicit physics</td><td>Medium; black box</td><td>Sensitive to shifts in the data</td></tr>
        <tr><th scope="row">Transformer<span>Data-driven</span></th><td>Very high on long sequences</td><td>Low to medium; can break physical rules</td><td>Medium; attention gives partial insight</td><td>Data-hungry and costly to compute</td></tr>
        <tr class="is-highlight"><th scope="row">PINN<span>Physics-informed</span></th><td>High</td><td>Very high; conservation, capacity and non-negativity built in</td><td>High</td><td>Costly to train; needs domain knowledge and careful tuning</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>How the model families compare, as assessed in the review (Table 9 of the paper). These are qualitative ratings; the measured errors on I-405 follow below.</figcaption>
</figure>

## What are the key findings?

We compared seven models on the same corridor: Caltrans PeMS loop-detector data from I-405 in Los Angeles, at 5-minute intervals over 81 weekdays from April 1 to July 31, 2017. The corridor has both recurring and non-recurring congestion.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/i405-speed-heatmap.png" alt="Heatmap of speeds at twelve detectors along I-405 from 11:30 to 19:30; a wide red band of speeds near 20 mph runs from mid-afternoon to about 18:30" loading="lazy" />
  <figcaption>Speeds along the I-405 study corridor through one afternoon. Each row is a loop detector; the red band is the bottleneck queue that a volume-delay function has to turn into travel time. From the paper (data: Caltrans PeMS).</figcaption>
</figure>

The models covered every family in the review: the classic volume-based BPR curve, a density-based BPR variant, a Greenshields fundamental-diagram model, a fluid-queue VDF, LSTM and Transformer networks, and a physics-informed neural network (PINN) that uses demand, congestion duration, queue length and capacity as inputs and cannot predict travel times below free flow.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/travel-time-error.png" alt="Horizontal bar chart of mean absolute error in minutes: BPR volume-based 4.335, BPR density-based 0.629, fluid-queue VDF 1.912, fundamental diagram 1.540, LSTM 0.480, Transformer 0.296, physics-informed neural network 0.077" loading="lazy" />
  <figcaption>Average error of predicted travel time on the test days, by model (Table 10 of the paper). The physics-informed neural network had the smallest error, 0.077 minutes.</figcaption>
</figure>

- The **classic BPR curve** had the largest error (4.335 minutes) because one V/C value gives one flat travel time for the whole period, while real travel time rises and falls with the queue.
- **Data-driven models** were accurate (Transformer: 0.296 minutes; LSTM: 0.480 minutes), but they reproduce patterns they have seen and raise questions about transfer to other roads or to future demand scenarios.
- The **fluid-queue VDF** had a larger error (1.912 minutes) but produced smooth, physically consistent travel-time profiles built from congestion duration and D/C, which is what planners need for "what if" analysis.
- The **physics-informed neural network** was the most accurate, with a mean absolute error of **0.077 minutes**, RMSE of 0.176 and MAPE of 0.261%, while respecting physical limits. The paper notes that more sensitivity testing is needed before treating this as a general result.
- Across the AI literature, models are mostly judged by point errors such as RMSE, rather than by system measures planners use, such as network delay, throughput, queue length and how long bottlenecks last. The review calls this a critical gap.

<figure>
  <img src="/media/system-modeling-pan-vdf-review/travel-time-comparison.png" alt="Line chart of observed and predicted travel time over one day in 5-minute steps, rising from about 12 to 40 minutes during congestion; the queue-based model is a smooth curve and the learning models track the observed jagged line" loading="lazy" />
  <figcaption>Observed and predicted travel time over one test day. The queue-based model (green) gives a smooth profile that captures the congestion period; the learning models follow the minute-to-minute swings. From the paper.</figcaption>
</figure>

## What can this be used for?

- **DOT and MPO modelers**: The paper gives a step-by-step workflow for calibrating VDFs from detector data (fit the fundamental diagram, estimate D/C and congestion duration, calibrate the curve, run assignment and report queue and delay measures) that fits into existing four-step and dynamic assignment models.
- **Planning for automated vehicles and demand management**: The micro-to-macro chain shows how to carry vehicle-level assumptions, such as shorter gaps, or demand-side policies, such as time-varying tolls, through to capacity, congestion duration and delay.
- **AI researchers**: The paper lists the physical constraints that make traffic AI trustworthy and argues for judging models by system-level measures, not only point errors.
- **Future research**: A roadmap of nine priority questions, from short-term calibration with multisource data, to reliability-aware VDFs, to real-time AI-driven VDFs for connected vehicles.
- **Reproducing the comparison**: The I-405 data and the code for all seven models are open on [GitHub](https://github.com/panyuyan/VDF-review-code).
