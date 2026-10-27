---
tldr: >-
  We reviewed how real-time traffic information and rewards, delivered through phones and other
  information and communication technologies, can change when, which way, how and where people travel
  and how they drive. Across 18 real-world programs and dozens of behavior studies, rewards ("carrots")
  repeatedly moved people out of the peak, but making the new habit last after the rewards stop is still
  an open question.
hero:
  image: /media/tang-atdm-review-atpp-2019/metropia-reserve-validate.jpg
  alt: >-
    Four phone screens from the Metropia app under two arrows labeled Reserve and Validate. The first
    screen shows a route map and a table of departure times: 5:45 pm takes 23 minutes for 20 points,
    6:00 pm takes 22 minutes for 20 points, and 6:15 pm takes 21 minutes for 30 points. The second lists
    reserved trips. The third is turn-by-turn navigation. The fourth says "You Have Arrived!" and shows
    70 points earned
  caption: >-
    Information and a reward in one app. To reserve a trip, the driver sees the predicted travel time and
    the points offered for each departure slot (here, leaving at 6:15 pm instead of 5:45 pm earns 30 points
    instead of 20). The app then follows the trip, and if the driver leaves at the reserved time and takes
    the suggested route, the trip is validated and the points are paid on arrival.
  credit: Metropia, Inc. (from X. Hu's 2016 PAG–University of Arizona seminar slides)
affiliations:
  - Missouri University of Science and Technology
author_affiliations: [[1], [1]]
abstract: |-
  Traditionally, methods to reduce traffic congestion has been focused on the capacity side. An increasingly popular approach is to look at issues from the demand side to trigger travel behavior changes, so as to achieve a better balance between the need to travel a particular route at a particular time and the capacity of available facilities which is defined by FHWA as active traffic and demand management strategy (ATDM). The provisions of dynamic traffic information and incentives are two most commonly seen methods to effectively influence people's travel behavior. This chapter aims to provide a comprehensive and in-depth review of the research work that focus on triggering travel behavior changes with the provisions of dynamic traffic information and incentives via Information and Communication Technologies (ICT). Real-world system developments and current practices in adjusting travel behaviors will be summarized first, followed by the review of various behavior change aspects, including departure time choice behavior, route choice behavior, mode choice behavior and destination choice behavior. Driving behavior, which is a densely populated topic is also reviewed and summarized. The reviewed studies are summarized and compared at the end of each corresponding section.
key_numbers:
  - { value: "18", label: "real-world programs and field experiments compared, from 1991 to 2018" }
  - { value: "16 of 18", label: "used rewards or subsidies rather than charges to change behavior" }
  - { value: "~60%", label: "less peak-hour driving by participants paid to avoid the rush hour in the Dutch Spitsmijden trial" }
  - { value: "71% vs 5.7%", label: "of the time, a traffic information service led callers to change their route, versus their travel mode" }
updated: 2026-10-27
---

## What problem does this research solve?

Traffic congestion happens when more people want to use a road than it can carry. It costs travelers time, burns extra fuel, adds greenhouse gas emissions and raises crash rates. For decades the main answer was on the **supply side**: build more lanes, or squeeze more capacity out of existing roads with better operations. That worked at first, but it has become increasingly expensive and hard to sustain.

The alternative is to work on the **demand side**: help some travelers choose a different time, route, mode or destination so that demand fits the roads we already have. The Federal Highway Administration calls this **Active Traffic and Demand Management (ATDM)**: using technology and real-time information to manage traffic as it unfolds and to influence people's need and intention to travel, without building new lanes.

ATDM sits between three older ideas, and the paper explains what it borrows from each and where it goes further:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Approach</th><th scope="col">How it works</th><th scope="col">The catch</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Traveler information (ATIS)<span>Google Maps, Waze, 511</span></th><td>Shows everyone the same current traffic conditions and leaves each traveler to react on their own.</td><td>Outcomes are hard to predict. If every driver is sent to the one free-flowing road, it soon jams too (the “herding” effect).</td></tr>
        <tr><th scope="row">Travel demand management (TDM)<span>vanpools, transit, congestion pricing</span></th><td>Programs for particular groups of commuters, or charges for driving at busy times and places.</td><td>Programs miss drivers who will not join them. Pricing is a “stick” that remains controversial, partly over fairness.</td></tr>
        <tr class="is-highlight"><th scope="row">Active traffic and demand management (ATDM)<span>merges ATIS, TDM and system management</span></th><td>Gives each traveler personal options (when to leave, which route, which mode) and coordinates them, using information and, often, rewards.</td><td>Has to work for ordinary drivers, and has to know which information and which rewards actually change behavior.</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Three ways to manage travel demand, as compared in the paper. ATDM goes beyond traditional TDM by reaching ordinary drivers and by using non-pricing strategies such as rewards.</figcaption>
</figure>

The two tools ATDM relies on most are **dynamic traffic information** (for example, a commuter learns of a crash ahead and leaves later, or a shopping trip is postponed because of a predicted delay) and **incentives**, which can be cash or lottery rewards, free transit tickets, feedback such as gas saved, or donations to environmental causes. Smartphones now deliver both, trip by trip. That raises a practical question for agencies and app builders: **what does the evidence say about what it takes to change how people travel?**

## What did we do?

This book chapter, in *Advances in Transport Policy and Planning*, gathers that evidence. It reviews real-world programs and research, mostly from the 1990s to 2018, along five kinds of behavior change:

- **Departure time:** when people leave.
- **Route:** which way they go.
- **Mode:** car, transit, carpool, bike or walk.
- **Destination:** where they go, for example which store.
- **Driving behavior:** how they drive, such as speeding and hard braking.

It starts with the programs and systems that have actually been deployed. At the end of each section, the reviewed work is compared in a table: whether a real product was built, whether it used information and communication technology (ICT), whether it relied on rewards ("carrots") or charges ("sticks"), how large it was and which choices it targeted. Research studies are compared by model, data source (field data or survey), data size, the information or incentive offered, the factors studied and the type of trips.

## What have real-world programs achieved?

The chapter compares **18 programs and field experiments** from around the world. The timeline below shows two trends. Almost all of them used **rewards or subsidies** rather than charges. And the newer programs increasingly deliver those rewards through **smartphone apps and other ICT**, which can personalize the offer and verify the trip automatically.

<figure>
  <img src="/media/tang-atdm-review-atpp-2019/programs-timeline.png" alt="Timeline from 1990 to 2020 of 18 programs. Twelve programs without ICT, from U-Pass Seattle in 1991 to free early subway rides in Singapore in 2013, all use rewards except variable bridge tolls in Lee County, Florida (pricing). Six programs with ICT: SmartRide Atlanta 1996 (neither), NuRide 2003, Spitsmijden Netherlands 2006, Metropia 2013, Bella Mossa Bologna 2017 and incenTrip DC–Baltimore 2018, all using rewards" loading="lazy" />
  <figcaption>The 18 programs compared in Table 1 of the paper, by start year. Blue dots used rewards or subsidies, the one red dot used pricing, and the grey dot used neither. Chart drawn from Table 1 of the paper.</figcaption>
</figure>

Many reported measurable results. A selection, as summarized in the paper:

<figure>
  <div class="table-scroll">
    <table class="compare-table">
      <thead>
        <tr><th scope="col">Program</th><th scope="col">What travelers were offered</th><th scope="col">Reported result</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">U-Pass, Seattle<span>University of Washington, from 1991</span></th><td>Transit passes, preferential parking, consumer discounts, rideshare matching</td><td>18% less morning-peak traffic in 2002 than in 1983; 33% fewer parking permits bought; 3,600 new parking spaces avoided</td></tr>
        <tr><th scope="row">Variable bridge tolls<span>Lee County, Florida, 1994</span></th><td>A 50-cent off-peak discount on two bridges</td><td>5% of traffic moved from the peak to off-peak periods</td></tr>
        <tr><th scope="row">One Less Car<span>Seattle, 2000–2002</span></th><td>$85 a week for 86 households, for 6 to 9 weeks</td><td>27% fewer drive-alone car miles; use of other modes up more than 20%</td></tr>
        <tr><th scope="row">Free bus ticket<span>Osaka, Japan, 2003</span></th><td>A one-month free bus ticket for 23 drivers (20 others as a control group)</td><td>Bus use 20% higher than before, but the change did not last</td></tr>
        <tr class="is-highlight"><th scope="row">Spitsmijden<span>A12 motorway, Netherlands, 2006</span></th><td>€3 to €7 for each morning rush hour avoided, or credit toward keeping a smartphone; 500 participants</td><td>Participants' peak traffic down about 60%, mostly by driving before or after the peak; travelers returned to the peak when the rewards ended</td></tr>
        <tr><th scope="row">Early-bird rail tickets<span>Melbourne, from 2008</span></th><td>Free train rides for trips finished before 7:00 am</td><td>23% of ticket users shifted out of the peak, by 42 minutes on average; pre-7:00 am loads up 41%</td></tr>
        <tr><th scope="row">Metropia pilot<span>Los Angeles, with LADOT, 2013</span></th><td>Travel time predictions and reward points in a smartphone app, for 10 weeks</td><td>Travelers who changed their behavior saved 20% of their travel time</td></tr>
        <tr><th scope="row">Travel Early, Travel Free<span>Singapore subway, 2013</span></th><td>Free rides when exiting 16 city-center stations before 7:45 am</td><td>7–8% fewer commuters in the morning peak window (a 2014 randomized trial found trips 5.5% more likely to end before the peak)</td></tr>
        <tr><th scope="row">Bella Mossa<span>Bologna, Italy, 2017</span></th><td>Points and gamified rewards for walking, cycling and transit trips</td><td>15,000 active participants, 900,000 sustainable trips and 3.7 million km in the first 6 months</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Results reported for selected programs, as summarized in the paper. The highlighted row shows both sides of the evidence: a large effect while rewards are paid, and a return to old habits afterwards.</figcaption>
</figure>

**Smartphone apps.** Two of the systems reviewed in detail combine information and rewards in an app. **Metropia**, launched in 2013, predicts travel times for every 15-minute departure slot and offers more points for less congested times and routes (see the screens at the top of this page). The app checks that the user really leaves at the reserved time and follows the route before paying the points, which can be redeemed for gift cards. Under the hood, models of the road network estimate and predict traffic in real time, with the goal of moving traffic from each driver choosing selfishly (user equilibrium) toward the best outcome for the whole network (system optimum); our page on [behaviorally induced system-optimal routing](/hu-behavior-induced-so-tdm-jits-2017/) explains how. A [10-week Los Angeles pilot](/hu-incentive-adm-ijtst-2015/) tested the app with real commuters, and our [study of 157 Metropia users in Austin](/hu-departure-time-ijst-2020/) looks at how their departure habits changed. Metropia's own [short explainer video](https://www.youtube.com/watch?v=hby3oAup4lA) shows the idea.

<figure>
  <img src="/media/tang-atdm-review-atpp-2019/tucson-data-coverage.jpg" alt="Street map of Tucson in which almost every road segment is colored by how many app trips used it, from orange (no coverage yet) through light blue, green and blue to dark navy (very high) on the main arterials and freeways" loading="lazy" />
  <figcaption>What such an app sees. Every road segment in Tucson colored by how many Metropia trips crossed it, about a year after the March 2015 launch: over 34,000 trips and over 32 million GPS points. The same data supports travel time, signal timing and safety analyses. Image: Metropia, Inc. (2016 seminar slides).</figcaption>
</figure>

**incenTrip**, developed at the University of Maryland with funding from the U.S. Department of Energy's ARPA-E TRANSNET program, studies how to offer the right travelers the right incentives at the right time in the Washington–Baltimore region. It predicts travel times across modes, offers points for energy-saving choices and runs a simulation of the whole regional transportation system in real time to decide which incentives to offer. By April 2018 it had about 35,000 registered users, roughly 0.4% of the region's 9 million people.

<figure>
  <img src="/media/tang-atdm-review-atpp-2019/incentrip-app-and-architecture.jpg" alt="Left: two incenTrip phone screens for a trip from the University of Maryland; a driving option worth 3 eco-points (32 minutes, 0.3 gallons of fuel) and a transit option worth 30 eco-points (57 minutes, no fuel). Right: a system diagram linking real-time transportation data, an incentive optimizer, behavior, traffic and energy simulators, cloud storage and the iOS and Android apps" loading="lazy" />
  <figcaption>incenTrip. Left: the app offers 3 eco-points for driving and 30 for a transit option that takes longer but uses no gasoline. Right: the system behind it, where simulators of traveler behavior, traffic and energy feed an incentive optimizer that decides what to offer each user. Images: incenTrip, University of Maryland, as shown in Fig. 2 of the paper.</figcaption>
</figure>

Parking is another target. Stanford University's **CAPRI** program (2012) gave credits to permit holders who drove onto campus at off-peak hours, which could win random cash rewards from $2 to $50. 3,082 commuters signed up for the driving program and 975 for walking and biking, and the rewards encouraged both off-peak driving and walking and biking.

## What do studies say about each kind of choice?

Not every choice is equally easy to change. In a survey of users of a traffic advisory phone service in the Cincinnati area, travel information led callers to change their route far more often than their mode:

<figure>
  <img src="/media/tang-atdm-review-atpp-2019/choice-shares.png" alt="Bar chart. Share of the time traffic information changed: route taken 71%, departure time 34%, destination 25%, travel mode 5.7%" loading="lazy" />
  <figcaption>How often callers to a traffic information service said the information changed each part of their trip (Aultman-Hall et al., 2000, as reviewed in the paper). Chart drawn from the numbers in the paper.</figcaption>
</figure>

**Departure time.** Most deployed programs target this choice. Studies broadly agree that work schedule flexibility, mode, occupation, income, age and the level of service on the road all shape when people leave. Some findings stand out:

- **Trust matters.** Chicago commuters were more likely to change when they left if they found traffic reports accurate and relevant, and more than 60% had used traffic information to change their travel decisions.
- **Other commitments limit flexibility.** When one study ignored people's non-work activities and their constraints, it overestimated how far they would shift their departure, especially toward later times, by more than double.
- **Rewards work, and should be tailored.** In the Spitsmijden data, both money and an in-kind reward (a smartphone) clearly reduced peak travel. A comparison of two consecutive reward schemes, each lasting more than a year, showed that sensitivity to incentives depends on trip purpose and time of day: in the morning peak, recreation, errands and work trips responded most; in the evening peak, other trips, errands and school trips did.
- **People learn from experience.** Studies of day-to-day learning, including our [Metropia study](/hu-departure-time-ijst-2020/), show that past travel experience, prediction accuracy and incentives shape the next day's choice. Good forecasts can help the network settle into equilibrium, while habit slows that process down.

**Route.** Navigation apps were built for this choice, so it has a large literature, mostly from simulators, laboratory experiments and surveys:

- **Accuracy and type of information both matter.** When information became less accurate, participants shifted not only to the reliable route but also to an alternative that was useless. Prescriptive advice ("take this route") changed behavior most, followed by descriptive information and then feedback from experience.
- **Rewards raise compliance.** In a multi-user experiment with a social navigation app, drivers were more willing to follow advice when they were well informed or rewarded.
- **More sharing is not always better.** More social interaction in an online travel community did not necessarily lead to better route choices for individuals or for the system.
- **Real trajectories reveal detour patterns.** Using second-by-second GPS traces from Metropia during a lane closure on Austin's MoPac Expressway, drivers' detours fell into three patterns that depended on trip length and distance to freeway entrances and alternative freeways ([see our page on that study](/hu-capacity-reduction-gps-jits-2019/)).
- **Taxis are a special case.** An earlier lab model [routed empty taxis to minimize the time to the next customer](/hu-vacant-taxi-routing-trr-2012/). Routing an empty taxi to maximize long-run earnings rather than just finding the next customer improved average unit profit by 23.0% and 8.4% over two simpler strategies, in a case study built from GPS data of more than 12,000 Shanghai taxis.

**Mode and destination.** These change less often but are studied with growing GPS data:

- **Unreliable driving can push people to transit**, mostly where the train is already faster than the car (Chicago data). But in-vehicle traffic information may, in some cases, lead to *less* transit use.
- **Carsharing reshapes the mix.** Portland members rode the bus, cycled and walked more after joining. In a 6,281-person North American survey, members walked, cycled and carpooled more, while overall transit use fell. Toronto's AutoShare members, who made 84,773 trips in 2010, used the cars mostly off-peak and on weekends.
- **Where people stop is predictable.** In-vehicle GPS data from Minneapolis–St. Paul showed that non-work destinations close to the line between home and work were more attractive, while those closer to downtown, or reached by routes with more turns or speed changes, were less attractive.

**Driving behavior.** Phones and in-vehicle recorders now capture speed, acceleration and braking for every trip, which moves safety analysis from crash statistics to individual drivers. The **100-Car Naturalistic Driving Study** recorded about 2 million vehicle miles and 43,000 hours of driving by 241 drivers. Analyses of it found that about 6% of drivers were high-risk, with 3.95 crashes and near-crashes per 1,000 miles, and that inattention contributed to 78% of all crashes in the study. The FHWA **Pay-As-You-Drive-And-You-Save (PAYDAYS)** project collected 131,537 trips by 503 drivers over 18 months (1,090,136 miles). Its key idea was to judge driving against its context, such as the road and the speed of surrounding traffic. Hard brakes, hard starts, peak-time travel, speeding and driving at a speed very different from traffic were all linked to higher accident rates. Three Atlas pages cover this work in depth: [contextual driving scores](/hu-ubi-contextual-risk-ietits-2019/), [a Bayesian network for crash risk](/zhu-bayesian-driving-risk-trc-2017/) and [insurance rate-making from GPS data](/ma-ubi-rate-making-tra-2018/).

<figure>
  <img src="/media/tang-atdm-review-atpp-2019/tucson-driving-safety-heatmap.jpg" alt="Map of Tucson overlaid with a blue haze along major roads and bright green hot spots at a few dozen intersections and arterial segments" loading="lazy" />
  <figcaption>The same app data can show where driving gets risky. A heat map from Metropia's driving-safety analysis in Tucson, which looked at hard-brake and harsh-start locations, frequent crash locations, road geometry and traffic conditions; bright green marks hot spots. Image: Metropia, Inc. (2016 seminar slides); base map © OpenStreetMap contributors.</figcaption>
</figure>

## What can this be used for?

- **Transportation agencies** looking for congestion relief without new lanes or road charges: the record of 18 programs shows that rewards, especially when delivered through apps that verify each trip, can move travelers out of the peak, and the comparison tables show what scale and design each program used.
- **App and program designers:** accurate predictions build the trust that makes people follow advice; rewards work best when tailored to the trip purpose and time of day; and commuters with flexible schedules are the easiest to move.
- **Researchers:** the chapter's comparison tables map which choices, data sources and models have been studied, and which are still thin.

The paper also names what remains open. Growing volumes of travel data will support better models of how people decide. Apps make it possible to run behavior experiments with a **human in the loop**: offer information and incentives, observe the response, and adjust within a short cycle. The biggest gap is **habit**: rewards clearly change behavior, but the hope is that the change lasts after the rewards are withdrawn, and how to achieve that has not been well studied. The authors call for interdisciplinary research that brings together traffic safety, psychology, economics and other fields to answer it.
