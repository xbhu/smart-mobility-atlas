---
tldr: >-
  We built a model of how a taxi driver with no passenger chooses streets: at every intersection the
  driver picks the next street that minimizes the expected time to the next customer. Tested on a
  2,332-link network of Taipei, it sends empty taxis toward busy areas such as Taipei 101 and has them
  circle there until someone hails, just as drivers describe.
hero:
  image: /media/hu-vacant-taxi-routing-trr-2012/taipei-study-area.jpg
  alt: >-
    Street map of a district of eastern Taipei. An oval marks the Taipei subway line running east to
    west, and a rectangle marks the Taipei 101 area in the south. Numbered boxes 1 to 6 mark landmarks
  caption: >-
    The Taipei district where we tested the model. The two marked zones were given higher customer
    arrival rates: the Taipei 101 area (rectangle) and the subway line (oval). Numbers mark the City
    Government (1), City Council (2), Sun Yat-Sen Memorial Hall (3), Taipei 101 (4), Grand Hyatt (5)
    and Songshan railway station (6).
  credit: Hu et al. (2012); base map © 2011 Google
affiliations:
  - University of Arizona
  - University of Massachusetts at Amherst
  - National Cheng-Kung University
author_affiliations: [[1], [2], [1], [3]]
abstract: |-
  Taxi cabs account for a significant portion of traffic in many Asian cities, and yet, the route choice of taxi drivers remains an active research area in the literature. The routing objectives of a taxi driver vary depending on the state of taxi occupancy. If a taxi is occupied by customers, then a least-cost path is usually sought. Several existing paradigms in the literature are related directly to such a routing objective. What is not well understood is the taxi driver's route choice behavior when a taxi is vacant, which is likely to be driven by a rather different objective. In this research, we propose a vacant taxi routing model in which taxi drivers are assumed to minimize expected search time for customers when making routing decisions at intersections. A probabilistic dynamic programming formulation of the problem and the solution algorithm are presented. We conduct numerical analysis on a hypothetical network resembling the traffic network structure in the City of Taipei. The outcomes of this case study show that the proposed model exhibits realistic and reasonable properties. This research has shed light on routing decisions of taxi drivers, which will directly support area-wide traffic management.
key_numbers:
  - { value: "40%", label: "of a Taiwan taxi's daily distance is driven empty (54.4 of 136.1 km)" }
  - { value: "90M", label: "liters of fuel a year burned by empty taxis in Taiwan" }
  - { value: "2,332", label: "links (755 nodes) in the Taipei test network" }
  - { value: "100%", label: "of the busiest links near Taipei 101 chosen by the model's taxis (96% along the subway line)" }
updated: 2026-10-27
---

## What problem does this research solve?

In many Asian cities, taxis are a large part of the traffic, and much of that traffic is **empty taxis looking for passengers**. A survey by Taiwan's Ministry of Transportation and Communications counted more than **88,000 taxis** in Taiwan, **73.5%** of which regularly cruise the streets for customers. A taxi drives **136.1 km** a day on average, and **54.4 km of it (40%) is driven with no passenger**: about **3.6 empty hours** a day, and about **90 million liters** of fuel a year. In urban Hong Kong, taxis make up about **25%** of all traffic, and **50–60%** at some critical locations. In Shenzhen, China, taxis were found to be empty for **41.6%** of their distance and **49.2%** of their time.

To manage that traffic, or simply to simulate it, we need to know **which streets these empty taxis take**. Traffic models normally assume every vehicle takes the quickest path to its destination. That is a fair assumption for a taxi with a passenger on board. But an empty taxi has no destination. The driver's goal is to **find the next customer as soon as possible**, and the decision is made over and over, at every intersection: which street to take next.

<figure>
  <picture>
    <source media="(max-width: 600px)" srcset="/media/hu-vacant-taxi-routing-trr-2012/occupied-vs-vacant-narrow.png" />
    <img src="/media/hu-vacant-taxi-routing-trr-2012/occupied-vs-vacant.png" alt="Two street grids. Occupied taxi: a blue line runs the short way from a pick-up point to a drop-off point. Vacant taxi: from a drop-off point with few customers, a blue line cruises toward a shaded busy area, where an orange arrow circles one block" loading="lazy" />
  </picture>
  <figcaption>With a passenger on board, a taxi takes the fastest route to the destination. An empty taxi has no destination: it heads toward places where customers are more likely to appear and circles there until it is hailed. This paper models the second case. Diagram based on the paper's model.</figcaption>
</figure>

This matters most in a street-hail market, where drivers decide for themselves where to go. (In a dispatch market, a dispatcher tells the driver where to pick up the next customer.) Interviews with taxi drivers in Taipei in 2011 showed how they think:

- Experienced drivers know **where and when customers appear**: residential areas generate many customers in the morning peak and commercial areas in the evening peak.
- After dropping off a passenger, a driver may circle around. If no customer turns up within **15–20 minutes**, the driver heads back to areas where more customers are known to show up.
- Drivers are aware of **competition** from other taxis, and some prefer or avoid certain kinds of customers.

There were network models of the taxi market as a whole, but **a model of how an individual empty taxi picks its streets, intersection by intersection, was missing.** This paper builds one.

## What did we do?

We started from four plain assumptions about a driver's behavior: (1) at each intersection, the driver tries to maximize the chance of reaching a customer; (2) past trips form the driver's "experience" of where and when customers are available; (3) that experience shapes the routing decision; and (4) it is updated by new trips. We then turned these assumptions into a model that a computer can solve for every street of a city.

<figure>
  <picture>
    <source media="(max-width: 600px)" srcset="/media/hu-vacant-taxi-routing-trr-2012/search-model-narrow.png" />
    <img src="/media/hu-vacant-taxi-routing-trr-2012/search-model.png" alt="Three gray panels. 1, Cut each street into short pieces: a road divided by tick marks, each piece about 5 to 10 seconds of driving, with a small blue taxi. 2, Customers appear at random: orange customer icons above some pieces of the road. 3, Choose the next street: a taxi at a four-way intersection with arrows for left (penalty), straight and right" loading="lazy" />
  </picture>
  <figcaption>How the model sees the city. Each street is cut into short pieces; customers appear on them at random; at each intersection the driver picks the next street that minimizes the expected time until the next pick-up. Diagram based on the paper's model.</figcaption>
</figure>

- **Short pieces of street.** Each street (link) is divided into pieces that take the same short time to drive, about **5–10 seconds** in a busy Asian city. If a customer appears on a piece while the taxi is driving through it, the taxi picks the customer up. Much longer pieces would be unrealistic (a competing taxi would get there first), and much shorter ones would make a pick-up almost impossible.
- **Random customers.** Customers appear on each street following a **Poisson process**, the standard model for random arrivals. Each street has its own **base arrival rate**, set by the homes, offices and shops around it. Instead of modeling every other taxi, the rate is scaled down to reflect competition.
- **Turns cost time.** Left turns take longer than going straight or turning right, and U-turns are often forbidden, so both get a **penalty**.
- **The goal.** The time from leaving an intersection until picking up a customer is the **search time**. It is random, so the driver minimizes its **expected value**.

We tested the model on one of the busiest districts of Taipei. It contains the Taipei City Government and Taipei City Council, the Sun Yat-Sen Memorial Hall, the Taipei 101 skyscraper with its flagship stores and the Grand Hyatt hotel, five metro (MRT) stations and the Songshan railway station: a mix of business, tourist and transfer trips that attracts many cruising taxis (map at the top of this page).

The model needs two inputs for every street: a travel time and a customer arrival rate.

- **Travel times** came from the DynusT dynamic traffic assignment model of the district, averaged into one value per street. The network has **755 nodes, 2,332 links and 11 traffic zones**. Travel times range from **0.1 to about 1.0 minute** per link.
- **Arrival rates** were *assumed*, since no field data on where customers hail taxis was available. Most link segments got a random rate between **0 and 0.5 customers per minute**; streets near Taipei 101 got **0.8**, and arterials along the subway line got **0.6**.

So the case study tests whether the model **behaves sensibly** on a realistic network, not whether it reproduces observed taxi trips.

## What is the key methodological contribution?

The paper formulates empty-taxi routing as a **probabilistic dynamic programming** problem and shows how to solve it exactly.

First, it derives the **expected search time on a single street**, working backward from the last piece of the street to the first, and the **probability of reaching the end of the street without a pick-up**. Both follow from the Poisson arrival rate and the street's travel time.

Then it builds the network problem. Each street is a **state**; the decision at its downstream intersection is which outgoing street to take next. A pick-up ends the search, so the problem is a special case of the **stochastic shortest path problem** (in Bertsekas' framework: infinite horizon, with a cost-free termination state). The minimum expected search times for all streets satisfy **Bellman's equations**. Because the states are streets rather than intersections, turn penalties fit in naturally.

The equations are solved by **policy iteration**:

1. Start with any feasible policy, meaning one next street for every street.
2. Evaluate it: compute the expected search time from every street by solving a set of linear equations (Gaussian elimination).
3. Improve it: at every street, switch to the next street with the lowest expected search time.
4. Repeat until the policy stops changing.

The result is not a single path but a complete **routing policy**: for every street in the network, the best street to take next, wherever the empty taxi happens to be.

<figure>
  <img src="/media/hu-vacant-taxi-routing-trr-2012/optimal-policy-network.png" alt="Black line drawing of the Taipei street network. Many street segments are drawn as thick double lines, the rest as thin lines" loading="lazy" />
  <figcaption>The optimal policy on the Taipei network. Thick lines are the streets chosen as the best next street from at least one other street; every street has exactly one best next street. Image: from the paper.</figcaption>
</figure>

## What are the key findings?

**Every optimal route ends in a loop.** Following the policy from any starting street gives one of two patterns:

- **A closed loop**: the taxi goes around a set of streets and back to where it started, and keeps circling until it picks up a customer.
- **Cruising, then a loop**: starting from a quiet street, the taxi drives toward an area with more customers and then circles there.

In both cases, wherever the taxi starts, it **heads for high demand and circles nearby until it is hailed**, the same behavior Taipei drivers described.

<figure>
  <img src="/media/hu-vacant-taxi-routing-trr-2012/closed-loops.png" alt="The Taipei street network with nine numbered dotted outlines marking small closed loops spread across the district, the largest near the bottom (area 2)" loading="lazy" />
  <figcaption>Closed loops found by the model. They sit in places that are busy in reality: for example the MRT Taipei City Hall station (1), Section 5 of Xinyi Road at Taipei 101 (2), the MRT Zhongxiao Dunhua station (6) and the Yongchun branch of the Taipei Municipal Library (9). Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/hu-vacant-taxi-routing-trr-2012/cruise-then-loop.png" alt="The Taipei street network with dotted lines tracing two routes: one leads down to a looped area labeled Taipei 101, the other to a loop labeled Subway Station, Taipei City Council" loading="lazy" />
  <figcaption>Cruising, then a loop. Taxis starting away from demand drive to the Taipei 101 area (bottom) or to the subway station near the City Council (middle), then circle there. Image: from the paper.</figcaption>
</figure>

One route shows the logic in numbers. A taxi starting on link 771→616, some way from Taipei 101, turns right and drives all the way there. Every street before node 634 has a base arrival rate between **0.13 and 0.49**; from node 634 on, every street has **0.8**, and those 12 streets form a closed loop that the taxi keeps driving.

<figure>
  <img src="/media/hu-vacant-taxi-routing-trr-2012/route-arrival-rates.png" alt="Bar chart of base customer arrival rate for 20 links in driving order. The first 8 blue bars, cruising toward Taipei 101, range from 0.13 to 0.49. The next 12 orange bars, a closed loop near Taipei 101, are all 0.80, after which the route returns to node 634 and repeats" loading="lazy" />
  <figcaption>Customer arrival rates along one optimal route. The taxi passes quieter streets on its way (blue), then loops on the busiest ones (orange). Chart: data from Table 1 of the paper.</figcaption>
</figure>

**Busier streets are chosen more often.** The model's taxis favor streets with a higher customer arrival rate and, perhaps surprisingly, a **longer travel time**: a longer drive along a busy street means more time for a customer to appear on it, which lowers the chance of passing through without a pick-up. All links with an arrival rate of 0.6 or more except one are part of the optimal policy: **all** links in the Taipei 101 area and **25 of 26 (96%)** along the subway line.

<figure>
  <img src="/media/hu-vacant-taxi-routing-trr-2012/chosen-share.png" alt="Bar chart of the share of links chosen by the optimal policy, by base arrival rate: 45% for 0 to 0.1, 60% for 0.1 to 0.2, 72% for 0.2 to 0.3, 81% for 0.3 to 0.4, 91% for 0.4 to 0.5, 96% for 0.6 (subway line) and 100% for 0.8 (Taipei 101)" loading="lazy" />
  <figcaption>The busier a street, the more likely the model's taxis use it: from 45% of the quietest links to all links in the Taipei 101 area. Chart: data from Figure 6 of the paper.</figcaption>
</figure>

Because the arrival rates were assumed, these are **properties of the model**, not measurements of real taxis. They are intuitive and reasonable, which is what a first model of this behavior needs to show; checking the model against real taxi data is the next step.

## What can this be used for?

- **Traffic simulation in taxi-heavy cities.** Simulation and dynamic traffic assignment models can route empty taxis by their real goal, finding customers, instead of sending them on shortest paths to made-up destinations.
- **Origin-destination estimation.** In regions where taxis are a large share of traffic, knowing which streets empty taxis use helps separate their trips from everyone else's when estimating travel demand.
- **Area-wide traffic management.** The model shows where empty taxis are likely to gather and circle, the streets where cruising adds to congestion.

The paper also sets out the next steps: calibrate the model with survey data from taxi drivers; estimate customer arrival rates from land use, taxi fleet or real-time traffic data; account for new technologies that help drivers cut empty cruising; and extend the model so that travel times and arrival rates change over the day.
