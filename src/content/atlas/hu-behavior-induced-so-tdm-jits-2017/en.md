---
tldr: >-
  We built a routing method that offers each traveler the departure time and route that adds the
  least delay for everyone, not just the fastest trip for that one driver, and simulations of Tucson
  and Austin showed that when only 10% of drivers follow it and shift their trips by up to 15
  minutes, total travel time on the Tucson network falls by 13.9%.
hero:
  video: /media/hu-behavior-induced-so-tdm-jits-2017/rice-funnel-loop.mp4
  poster: /media/hu-behavior-induced-so-tdm-jits-2017/rice-funnel-loop-poster.jpg
  loop: true
  alt: >-
    Two glass funnels over beakers. On the left, rice is poured in a thin, steady stream and runs
    straight through. On the right, a whole beaker of rice is dumped in at once and the funnel fills
    up and backs up
  caption: >-
    The idea in one picture: dump everything into the funnel at once (right) and it backs up; feed it
    a steady stream (left) and it keeps flowing. Spreading trips over time and space does the same
    for a road network. Video: rice-and-funnel demonstration from the authors' 2014 presentation.
affiliations:
  - University of Arizona
  - Texas A&M Transportation Institute
author_affiliations: [[1], [1], [2]]
abstract: |-
  The basic design concept of most Advanced Traveler Information Systems (ATIS) is to present generic information to travelers, leaving travelers to react to the information their own way. This "passive" way of managing traffic by providing generic traffic information makes it difficult to predict outcome and may even incur adverse effect, such as overreaction (a.k.a. the herding effect). On the contrary, Active Traffic and Demand Management (ATDM) is another approach that has been receiving continual attention from both academic research and real-world practice, aiming to effectively influence people's travel demand, provide more travel options, coordinate between travelers, and reduce the need for travel.

  The research interest discussed in this paper is how to provide users with a travel option that aims to minimize the marginal system impact that results from this routing. The goal of this research is to take better advantage of the available real time traffic information provided by ATIS, further improve the system level traffic condition from User Equilibrium (UE), or a real world traffic system which is worse than UE, towards System Optimal (SO), and avoid passively managing traffic which may incur adverse effect. A behaviorally-induced, system optimal travel demand management model is presented to achieve this goal through incremental routing. Both analytical derivation and numerical analysis have been conducted on Tucson network, AZ, as well as Capital Area Metropolitan Planning Organization (CAMPO) network in Austin, TX. The outcome of both studies show that our proposed modelling framework is promising for improving network traffic conditions towards SO, and results in a vast amount of economic savings.
key_numbers:
  - { value: "13.9%", label: "less total travel time in Tucson when 10% of drivers shift by up to 15 minutes" }
  - { value: "4.0 min", label: "saved on average by drivers who changed nothing at all" }
  - { value: "$159M", label: "a year in estimated time savings in Tucson, against $7.4M to $23.4M in incentives" }
  - { value: "215,900 h", label: "of travel time saved per day in a 2035 Austin scenario" }
updated: 2026-10-27
---

## What problem does this research solve?

For decades the standard answer to congestion has been to build more road. It is expensive, and new capacity tends to fill up again as more trips are induced. **Travel demand management** takes the other route: instead of adding supply, it tries to change *when* and *how* people travel, through flexible work hours, ridesharing, transit, and, more recently, smartphone apps.

Navigation apps and other traveler information systems are a natural tool for this, but most of them work in a **passive** way. They tell every driver the same thing ("this road is clear") and each driver reacts on their own. If everyone is sent to the same free-flowing road, it soon jams, and drivers find themselves sitting in a queue again. This is the **herding effect**.

The root of the problem is what a routing app tries to minimize. It gives each driver the path with the **lowest travel time for that driver**. It ignores the delay that this trip adds for everyone else on the same roads, now and later. Traffic engineers call the result **user equilibrium**: every driver is doing the best they can for themselves, but the network as a whole is not doing as well as it could. The alternative, the **system optimum**, is the traffic pattern with the lowest total travel time for everyone. It usually needs some drivers to take a slightly different time or route than they would have picked for themselves, so it has long been seen as hard to put into practice.

This paper asks whether it is possible to get part of the way there with **a travel option for each traveler that keeps the extra delay they cause others as low as possible**, offered to the share of drivers who are willing to follow it.

## What did we do?

We built a **behaviorally induced, system optimal** demand management model. "Behaviorally induced" means that nobody is forced: the system shows a traveler several choices of departure time and route, with their travel times and incentives, and the traveler decides. In practice this was built into **Metropia**, a smartphone app in which drivers earn reward points for choosing less congested departure times. The model only needs *some* drivers, even a small share, to make a better-informed choice.

<figure>
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/metropia-app.jpg" alt="Three phone screens from the Metropia app. The first two show a route map and a table of departure times with predicted travel time and reward points for each; the third says You Have Arrived with points earned" loading="lazy" />
  <figcaption>How a traveler sees the options in the Metropia app: a predicted travel time and reward points for each departure slot. The model in this paper decides which departure times and routes are good for the whole network, and so which options to encourage. Image: Metropia app screenshots, from Hu et al. (2020).</figcaption>
</figure>

The model assigns travelers **one at a time** (incremental routing). For each traveler it tries every departure time in the window the traveler is willing to shift, one minute apart. For each one it searches for the route with the lowest **marginal cost** and adds a penalty for arriving earlier or later than the traveler wants. It then picks the combination with the lowest total. Once that traveler is placed on the network, the traffic volumes and costs on every road they use are updated **before the next traveler is routed**. Because each new traveler sees the effect of everyone routed before them, the model does not send everyone to the same road, which is how it avoids the herding effect.

<figure class="figure-narrow">
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/incremental-routing.png" alt="Flowchart with seven numbered steps: take the next traveler; try every departure time in the allowed window one minute apart; for each find the route with the lowest marginal cost; add the penalty for arriving early or late; recommend the departure time and route with the lowest total cost; load this traveler and update link volumes and marginal costs; after the last traveler simulate the whole network in DynusT. A yellow arrow loops from step 6 back to step 1" loading="lazy" />
  <figcaption>The incremental routing loop. Steps 1 to 6 repeat for every traveler; once all are assigned, a full traffic simulation measures the result. Diagram redrawn from Figure 1 of the paper.</figcaption>
</figure>

We tested the model on two real regional networks in the dynamic traffic assignment model **DynusT**, which simulates how traffic moves and queues minute by minute:

- **Tucson, Arizona, around Interstate 10**: 395 nodes, 830 links and 80 traffic zones, with **166,634 drivers** over a four-hour period whose second hour is the peak.
- **Austin, Texas (the Capital Area Metropolitan Planning Organization network)**: 10,295 nodes, 21,368 links and 1,462 zones, under the heavy congestion projected for **2035**. This test was part of a Texas A&M Transportation Institute study of long-term improvement options for Interstate 35.

<figure>
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/study-networks.png" alt="Left: a line drawing of the Tucson road network, with Interstate 10 running diagonally from the upper left to the lower right through a grid of local roads. Right: a map of the Austin region showing the counties around Travis County and a dense green mesh of traffic analysis zones" loading="lazy" />
  <figcaption>The two test networks. Left: the Tucson network around Interstate 10, which runs diagonally through the city. Right: the much larger Austin regional network and its 1,462 traffic zones. Images: from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The key step is to route each traveler by **marginal cost** instead of travel time. When one more car enters a road, the total cost has two parts: the time that driver spends on the road, and the small extra delay the car causes **every vehicle that uses the road after it**. The paper derives this marginal cost for each road and each time of day from a standard volume-delay function, and uses it as the "length" of each road in a modified time-dependent A\* shortest-path search. The route it finds is not the fastest for the driver, but the one that adds the least delay to the system. As each traveler is placed and the costs are updated, one driver's effect spreads to every later driver on the network.

Two other choices make the method practical:

- **Departure time is a choice, not a given.** Most earlier system optimal studies fixed when people leave and only changed their route. Here the model searches over departure time and route together, while a schedule penalty keeps people from being told to arrive much earlier or later than they want.
- **Only some drivers need to take part.** Earlier work often assumed that every driver follows the system's advice. This model is built for **partial participation**: it asks how much the whole network gains when only a fraction of drivers, motivated by incentives, follow system optimal advice.

The method is designed to run at regional scale. A whole region with several hundred thousand drivers over a 24-hour period takes about an hour to compute.

## What are the key findings?

**1. A small shift makes a big difference.** In the first Tucson scenario, just **10% of travelers** were allowed to change their departure time by **up to 15 minutes**. Total travel time on the network fell by **13.9%**, from 131,639 to 113,384 hours, a saving of 18,255 hours. Demand in the peak hour fell by **8.4%**. Of the 13,688 travelers who changed their plans, 7,210 changed only their departure time, 6,475 changed both departure time and route, and only 3 changed only their route: **when** people leave mattered far more than **which road** they took.

**2. Everybody wins, including those who change nothing.** Drivers who shifted saved the most: **20.9 minutes** on average for those who changed only their departure time, **18.3 minutes** for those who changed both time and route, and **11.9 minutes** for those who changed only their route. But the drivers who changed nothing also saved **4.0 minutes** on average, simply because the roads were less congested.

**3. More flexibility, less congestion, with the biggest gains at the start.** Four Tucson scenarios combined different shares of participating drivers (10% to 30%) and different shifting windows (15 to 120 minutes). The heat maps show congestion on Interstate 10 shrinking as more drivers take part and as they accept bigger shifts.

<figure>
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/i10-sb-heatmaps.png" alt="Five heat maps side by side, labeled Baseline, SC1, SC3, SC6 and SC7. Each shows time from 12:00 to 4:00 across and distance along the freeway up the side. A large orange and red wedge of slow traffic fills the baseline map; it shrinks step by step, and in SC7 the bottom part of the wedge has disappeared" loading="lazy" />
  <figcaption>Speeds on southbound Interstate 10 in Tucson, by time (across) and distance along the corridor in thousands of feet (up). Red and orange mean slow, congested traffic; dark blue means free flow. From left: no change, then 10% of drivers shifting up to 15 minutes (SC1) or 60 minutes (SC3), 20% up to 120 minutes (SC6), and 30% up to 120 minutes (SC7). Image: from the paper, labels added.</figcaption>
</figure>

<figure>
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/tucson-total-travel-time.png" alt="Horizontal bar chart of total travel time on the Tucson network. Baseline 131,639 hours. SC1 113,384 hours, 13.9% less. SC3 113,099 hours, 14.1% less. SC6 91,898 hours, 30.2% less. SC7 79,658 hours, 39.5% less" loading="lazy" />
  <figcaption>Total travel time on the Tucson network in each scenario. Chart drawn from the data behind Figure 10 of the paper.</figcaption>
</figure>

The gains do not grow in a straight line. The savings from SC1 (10% of drivers, 15 minutes) and SC6 (20%, 120 minutes) added together are larger than the saving from SC7 (30%, 120 minutes) alone. **The first drivers who change their behavior bring the largest benefit to the system**, which is good news for programs that can only persuade a small share of commuters.

**4. The savings are far larger than the cost of the incentives.** Valuing time at $16.79 per person-hour (Texas A&M Transportation Institute 2011 Urban Mobility Report), the first Tucson scenario saves an estimated **$159 million a year** over two peak hours on 260 workdays. Paying travelers to shift, at the rates measured in incentive experiments in Europe (the Dutch Spitsmijden study) and in the United States, would cost about **$7.4 million** or **$23.4 million a year**.

**5. In Austin, the approach worked even under 2035 congestion.** The Austin study compared nine options for Interstate 35, including HOV lanes, express lanes, system-wide dynamic pricing and three new tunneled express lanes in each direction. Adding system optimal routing on top of the express lane option (scenario 2d) gave the **lowest person-hours traveled of all nine: 3.66 million a day, against 3.88 million in the base case**. With 20% of peak drivers taking part and up to 60 minutes of flexibility, the network saved **about 215,900 hours of travel time per day**, and congestion on the general purpose lanes of Interstate 35 eased in both directions.

<figure>
  <img src="/media/hu-behavior-induced-so-tdm-jits-2017/ih35-heat-diagrams.png" alt="Four speed heat diagrams of Interstate 35 in Austin over 24 hours, southbound on top and northbound below. The left column is the 2035 base scenario and the right column is scenario 2d with system optimal routing. Red and yellow areas of slow traffic are visibly smaller in the right column, especially northbound in the morning" loading="lazy" />
  <figcaption>Speeds on the general purpose lanes of Interstate 35 in Austin over a full day in 2035, southbound (top) and northbound (bottom). Left: base case. Right: with system optimal routing (scenario 2d). Red and yellow mean slow traffic, and there is noticeably less of it in both directions. Image: from the paper.</figcaption>
</figure>

The sensitivity tests show the same pattern as in Tucson. Participants always benefit more than non-participants, and everyone gains more as participation and flexibility grow together:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Drivers taking part (peak)</th><th scope="col" class="num">Max shift</th><th scope="col" class="num">Travel time saved per day</th><th scope="col" class="num">Saving for drivers who shift</th><th scope="col" class="num">Saving for other peak drivers</th><th scope="col" class="num">Annual saving</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">5%</th><td class="num">±15&nbsp;min</td><td class="num">14,337&nbsp;h</td><td class="num">9.0%</td><td class="num">1.0%</td><td class="num">$59.6M</td></tr>
        <tr><th scope="row">10%</th><td class="num">±30&nbsp;min</td><td class="num">72,092&nbsp;h</td><td class="num">18.2%</td><td class="num">4.0%</td><td class="num">$299.9M</td></tr>
        <tr><th scope="row">10%</th><td class="num">±60&nbsp;min</td><td class="num">153,890&nbsp;h</td><td class="num">33.4%</td><td class="num">8.0%</td><td class="num">$640.2M</td></tr>
        <tr><th scope="row">20%</th><td class="num">±30&nbsp;min</td><td class="num">111,911&nbsp;h</td><td class="num">17.5%</td><td class="num">6.3%</td><td class="num">$465.5M</td></tr>
        <tr class="is-highlight"><th scope="row">20%</th><td class="num">±60&nbsp;min</td><td class="num">215,925&nbsp;h</td><td class="num">31.2%</td><td class="num">12.1%</td><td class="num">$898.2M</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Sensitivity tests on the 2035 Austin network, from Table 3 of the paper. Savings for drivers are relative to their travel time without the app. Note that 10% of drivers with a 60-minute window save more than 20% of drivers with a 30-minute window: flexibility matters as much as numbers.</figcaption>
</figure>

## What can this be used for?

- **Navigation and traveler information apps.** Instead of sending every user down the currently fastest road, an app can offer options that also keep down the delay a trip adds for others, and so avoid creating the next traffic jam itself.
- **Incentive-based demand management programs.** The results give agencies and employers a way to estimate how much congestion relief to expect from a given share of participating commuters and a given amount of flexibility, and to compare that with what incentives cost.
- **Corridor and regional planning.** The Austin study shows that a low-cost, no-construction strategy can be tested side by side with capacity additions, managed lanes and pricing in the same regional model.
- **Program design.** Because the first participants bring the largest gains, programs do not need to wait for wide adoption to make a difference.

Future work includes a more precise marginal cost calculation and faster computation, so that the model can run as a real-time online service.
