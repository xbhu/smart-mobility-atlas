---
tldr: >-
  We modeled how electric vehicle drivers choose routes and chargers when many trips share the
  same capacity-limited chargers at malls and parking lots on local streets, proved that the
  resulting equilibrium is well defined, and built a price-based algorithm that finds it 30–42%
  faster than a standard path-based method and about 75% faster than Frank–Wolfe on the Chicago
  network.
hero:
  image: /media/song-community-charging-assignment-nse-2026/community-charging-sketch.png
  alt: Sketch of a street grid below a freeway. Colored routes from four homes travel along the freeway and local streets and converge on one parking lot with three green chargers, entering through two driveways (red dashed lines); cars of all four colors are plugged in side by side
  caption: >-
    Community charging in one picture: drivers from four different homes reach the same
    shopping-center charger through different local streets and two driveways, so they all share
    its plugs and its wait. Our model captures exactly this sharing.
affiliations:
  - Alfred State College, State University of New York
  - The Pennsylvania State University
  - Norfolk Southern Corporation
  - Arizona State University
author_affiliations: [[1], [2], [3], [4]]
abstract: |-
  Community charging—placing electric vehicle (EV) chargers in communal spaces such as shopping malls, public parking, and activity centers embedded in local street networks—creates a spatial equilibrium problem with an access and coupling structure that corridor charging along freeways does not exhibit. Multiple origin–destination pairs and routes converge on the same community charger via overlapping local arterials, so charger waiting times depend on the aggregate inflow from many paths and a single hardware capacity simultaneously constrains feasible flow for many travelers. On the physical network, these features make the generalized link costs non-separable across the links feeding a shared station. We formulate community charging as a capacity-constrained spatial equilibrium with station-level capacity side constraints, and we show it is exactly a Beckmann program with arc-capacity side constraints on a station-expanded network, restricted to range- and access-feasible paths. The capacitated user-equilibrium theory therefore applies, while the community-charging structure lies in the admissible paths and in the queueing origin of the station cost and capacity. We prove the cross-link symmetry that certifies the potential on the physical network, characterize the KKT solution as a generalized user equilibrium with endogenous station prices, and establish uniqueness of equilibrium flows under strict convexity. To solve the program, we develop a primal–dual decomposition: an outer augmented-Lagrangian loop adjusts station-level shadow prices on capacity, and an inner column-generation loop solves parallelizable path-flow subproblems for each OD pair under the current prices. Numerical experiments on a toy network, the Sioux Falls network, and two real-world community-charging networks show that the proposed method consistently attains equilibrium (to the reported tolerances) and outperforms a path-based interaction-ignored algorithm and a link-based interaction-aware Frank–Wolfe algorithm in computational efficiency.
key_numbers:
  - { value: "30–42%", label: "faster than a path-based method that ignores the shared waits, on all four test networks" }
  - { value: "~75%", label: "faster than the Frank–Wolfe algorithm on Chicago Sketch (413 s vs. 1,658 s)" }
  - { value: "288", label: "community chargers in the largest test network, shared by 93,135 origin–destination pairs" }
updated: 2026-10-26
---

## What problem does this research solve?

**Community charging** means putting electric vehicle (EV) chargers where people already spend time: shopping malls, community centers, parks and public parking lots on local streets. It serves residents without a home charger, delivery fleets, ride-hailing drivers and shared vehicles, who top up their batteries while shopping, working or parking near home. The U.S. Joint Office of Energy and Transportation contrasts it with **corridor charging**, the fast chargers spaced tens of miles apart along interstates for long trips. Federal programs are paying for both: the National Electric Vehicle Infrastructure (NEVI) program provides $5 billion and the Charging and Fueling Infrastructure (CFI) grant program $2.5 billion for publicly accessible charging.

The network models that planners use to predict where EV drivers go and where they charge were built for the corridor case. There, each charger sits on one freeway node or link, and each origin–destination (OD) pair effectively sees its own queue. Community chargers break both assumptions:

- **Many routes, one charger.** Drivers from many origins and routes reach the same mall charger through different local streets. The wait at the charger depends on the combined arrivals from all of them, so the cost of driving down one access street depends on traffic on the other streets that feed the same station.
- **One hardware capacity, shared by everyone.** A charger can serve only so many cars per hour. That single limit applies at once to every OD pair and route that uses it, which ties together trips that would otherwise be independent.

<blockquote class="pull-quote">
  <p><strong>To our knowledge, before this paper no model treated community charging as a network equilibrium</strong> with a queue-based waiting cost at each charger and a capacity shared across all its users.</p>
</blockquote>

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/three-model-categories.png" alt="Three stacked versions of the same small network with nodes 1 to 8. Bottom: distance-constrained models, routes limited by a 5-mile range. Middle: corridor charging models, chargers 7 and 9 sit on freeway links. Top: community charging, charger 10 sits off the freeway and is reached by thin dashed local arterials from several nodes" loading="lazy" />
  <figcaption>Three generations of EV network models on the same small network. Bottom: early models only check that routes fit within battery range. Middle: corridor models put chargers on freeway links. Top (this paper): a community charger (node 10) sits off the freeway and is reached from several directions by local streets (thin dashed lines). From the paper.</figcaption>
</figure>

## What did we do?

We wrote down the problem a regional planner faces. The road network is given, with a known set of community chargers attached to it by short **access links**, like the driveways into a parking lot. Travel demand between each origin and destination is fixed, every vehicle is an EV with a limited range, and each driver picks a route **and** where (or whether) to charge on the way. A driver's cost is the driving time on each road plus the waiting and charging time at the charger, which grows with the total number of cars arriving there. Each charger has a hard limit on how many arrivals it can serve.

A few common-sense rules make "using a charger" precise: you leave a charging lot by the same driveway you came in (you cannot cut through it as a shortcut), entering a charger means you charge there, charging is optional if your battery reaches the destination anyway, and a trip charges at most once at any one station.

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/toy-network.png" alt="Network diagram: eight black nodes joined by thick arrows labeled with distances of 2 or 3 miles, plus two green charger nodes, 9 and 10, each connected to two nearby nodes by red dashed access links of 0.5 to 1 mile" loading="lazy" />
  <figcaption>The toy network used throughout the paper. Two community chargers (green, nodes 9 and 10) hang off the road network on red dashed access links. EV range is 5 miles, so the trip from 1 to 3 (20 vehicles) cannot go direct; it must stop at a charger, and its four feasible routes include 1–2–9–2–3 and 1–4–5–10–5–3. The trip from 6 to 8 carries 10 vehicles. From the paper.</figcaption>
</figure>

The model is static: it describes a steady state in which arrivals at each charger balance departures, rather than how queues build up and clear over the day. We then tested it on four networks of increasing size, from the toy network to the Chicago Sketch network with 288 community chargers.

## What is the key methodological contribution?

**A price for every charger.** When a charger is full, drivers who use it and drivers who avoid it can end up with different driving-plus-waiting times, so the classic rule that "all used routes cost the same" no longer holds. We restore it by attaching a price to each charger. The price is zero while the charger has spare room and becomes positive only when it is at capacity, just high enough to keep arrivals within that capacity. It can be read in two equivalent ways: as an access charge that an operator or reservation platform could post, or as the extra delay that rationing a full charger imposes in practice. With these prices included, every route a driver actually uses costs the same, and no unused route is cheaper.

**The math is well posed.** On the real road network, the interaction at chargers makes the costs of different access streets depend on each other, which normally makes equilibrium problems hard to analyze. We proved that this interaction is symmetric, so the whole problem can still be written as a single minimization (a Beckmann program, the standard tool of traffic assignment). An equivalent picture makes this concrete: split each charger into an entrance, a "charging" link and an exit, and the community-charging problem becomes an ordinary traffic assignment with a capacity on that charging link. We showed that the charger prices are exactly the multipliers of those capacities and that the equilibrium traffic on every link and charger is unique.

**A fast price-based algorithm.** The algorithm, called ALM–CG, alternates two loops. The outer loop adjusts one price per charger, not one per OD pair or route, so the number of prices stays small even when there are tens of thousands of OD pairs. The inner loop lets every OD pair, in parallel, find its cheapest routes under the current prices.

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/price-loop-en.png" alt="Diagram of four steps in a loop: post a price at each charger; each OD pair picks its routes; add up arrivals at each charger; adjust the prices. Steps 2 and 3 are the inner loop, step 4 the outer loop. Repeat until no charger is over capacity and no driver can find a cheaper route" loading="lazy" />
  <figcaption>How the algorithm works. The charger prices are the only information passed between the network level (step 4) and the route choices of individual OD pairs (step 2), which can be computed in parallel.</figcaption>
</figure>

## What are the key findings?

**The prices do what they should.** On the toy network, charger 10 can serve 8 vehicles per unit time. If its capacity is ignored, 8.35 arrive and it is overloaded. With the capacity enforced, arrivals are held to exactly 8.00 and charger 10 carries a price of 2.07 time units, while charger 9, which has plenty of room, keeps a price of zero. For the trip from 6 to 8, the two routes in use then cost 16.99 and 14.91 + 2.07 = 16.98, equal once the price is counted.

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/toy-charger-flows-en.png" alt="Bar chart of arrivals at two chargers. Charger 10, capacity 8: 8.35 when capacity is ignored (over capacity), 8.00 when enforced (price 2.07). Charger 9, capacity 30: 21.65 and 22.00, price 0" loading="lazy" />
  <figcaption>Arrivals at the two chargers of the toy network, with and without the capacity limit. Only the charger that would be overloaded gets a price. Data from the paper (Table 5).</figcaption>
</figure>

**Ignoring the shared wait gives the wrong answer.** A standard path-based method that treats each access street's cost as depending only on its own traffic does not reach the true equilibrium: on the toy network its three routes from 1 to 3 end up costing 26.53, 25.70 and 26.42, so drivers could still save time by switching.

**The algorithm scales.** We compared ALM–CG with two benchmarks, each wrapped in the same price loop so that all three respect the charger capacities: the path-based method that ignores the shared wait, and a link-based Frank–Wolfe algorithm that does account for it. ALM–CG was 30–42% faster than the first on all four networks and about 75% faster than Frank–Wolfe on Chicago Sketch, where it needed about a quarter of the time. The time saved grows with network size, from about 2 seconds on the toy network to over 1,200 seconds on Chicago Sketch.

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/test-networks.png" alt="Three road network maps: the Sioux Falls grid with five green chargers attached by dashed links, the dense Eastern Massachusetts highway network, and the Chicago Sketch street grid" loading="lazy" />
  <figcaption>The test networks beyond the toy example: Sioux Falls with 5 community chargers (left), Eastern Massachusetts with 25 (middle) and Chicago Sketch with 288 (right). From the paper.</figcaption>
</figure>

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/solve-time-en.png" alt="Bar charts of solution time in seconds for three algorithms on four networks. Toy: 0.67, 0.96, 2.43. Sioux Falls: 5.81, 9.42, 19.86. Eastern Massachusetts: 57.95, 99.08, 142.13. Chicago Sketch: 413.40, 710.19, 1,657.63. Our algorithm is fastest on every network" loading="lazy" />
  <figcaption>Time to reach equilibrium on each network. Our algorithm (dark blue) is the fastest everywhere, and the gap widens on the largest network. Data from the paper (Table 7).</figcaption>
</figure>

**Charger capacity works mainly through waiting time.** On the Eastern Massachusetts network, scaling charger capacity up lowers both the total system travel cost and the total time spent at chargers, with diminishing returns at higher capacity. The driving-time part barely changes, so capacity affects the system mainly through charging waits. Scaling demand up raises total time at chargers faster than linearly.

<figure>
  <img src="/media/song-community-charging-assignment-nse-2026/sensitivity.png" alt="Four bar charts. Top row: as the charging supply scale factor rises from 0.2 to 0.8, total system travel cost falls from about 37,000 to 10,000 and total dwelling time from about 32,000 to 5,000. Bottom row: as the demand scale factor rises from 0.2 to 0.8, travel cost rises from about 5,200 to 8,000 and dwelling time from about 500 to 3,000" loading="lazy" />
  <figcaption>Eastern Massachusetts network. Top: more charger capacity (left to right) cuts total travel cost and time at chargers, with the biggest gains at first. Bottom: more charging demand raises both, and time at chargers grows fastest. From the paper.</figcaption>
</figure>

## What can this be used for?

- **Agencies and utilities planning community chargers under NEVI or CFI**: predict how drivers will spread across a proposed set of chargers once they react to each other's queues, and see which chargers will fill up. A charger's equilibrium price measures how scarce its capacity is, which points to where added plugs would help most.
- **Charger operators and reservation platforms**: the station prices are the access charges that would keep each site within capacity, a starting point for pricing or reservation schemes.
- **Other shared facilities on a network**: the same machinery applies wherever many routes converge on a facility whose wait and capacity depend on total use, such as parking garages, curbside freight bays and seaport berths.
- **Researchers**: because the route-choice step splits by OD pair, the method extends naturally to distributed computing across subregions. The paper outlines next steps toward a dynamic version with queues that evolve over the day, random day-to-day demand, chargers tied to renewable power, and equity and reliability measures for investment analysis.
