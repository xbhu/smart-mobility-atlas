---
tldr: >-
  In a 10-week pilot with 36 Los Angeles commuters, Metropia, an app that predicts traffic and pays
  reward points for off-peak departures and less congested routes, predicted travel times within
  15.2% on average, drivers changed their usual departure time on 60% of trips, and those who changed
  saved about 20% of their travel time.
hero:
  image: /media/hu-incentive-adm-ijtst-2015/metropia-app-trip.jpg
  alt: >-
    Three phone screens from the Metropia app. The first shows a route on a map and a table of three
    departure times with arrival time, trip duration and reward points, above a "Reserve Trip" button.
    The second shows turn-by-turn navigation with an arrival time of 5:24 pm. The third says "You Have
    Arrived!" with 70 points earned
  caption: >-
    A trip with Metropia. Before leaving, the driver compares departure times by predicted travel time
    and reward points and reserves one (left); the app then guides the driver along the reserved route
    (middle) and pays the points on arrival (right).
  credit: Screens from a later version of the Metropia app, Metropia, Inc.
affiliations:
  - Metropia, Inc.
  - University of Arizona
author_affiliations: [[1], [2], [2]]
abstract: |-
  Most current Travel Demand Management (TDM) programs such as vanpooling, ridesharing, or transit focus on managing travel demand of specific groups of commuters but are limited in effectively managing demand for automobile drivers, who are unable or unwilling to participate in such programs.

  This paper highlights results from a pilot field study conducted in a large west coast city experiencing major traffic congestion, and documents results of the use of an incentive-based active demand management (ADM) system focusing on automobile commuters. The system, called "Metropia," predicts future traffic conditions, applies a proprietary routing algorithm to find time-dependent shortest paths for different departure times, and, based on user request, provides automobile travelers with multiple departure times and route choices. Each of these travel choices are assigned points values, with higher points (and thus more valuable rewards) available for travelling during off-peak times and less congested routes, and lower points available for peak traffic travel times. The goal of this ADM system is to improve traffic flow and commuter travel times citywide, alleviating heavily congested areas without the use of new roadway construction by incentivizing travelers to change their travel behavior and avoid traffic congestion.

  The level of rewards points available to users (commuters) by the system depends on the travelers' behavioral change degree and their contributions to traffic congestion alleviation. This system was implemented in Los Angeles, Calif., USA, as a small scale pilot field study carried out beginning April 2013 and lasting for 10 weeks. Results from this field study show the system is able to accurately predict travel time with Relative Mean Absolute Error (RMAE) as low as 15.20%. Significant travel behavior changes were observed which validate the concept of using incentives to influence people's travel behavior. Furthermore, field study results show 20% travel time can be saved for people who changed their travel behavior.
key_numbers:
  - { value: "15.2%", label: "average error of predicted travel times, against about 30% and 40% for two major navigation apps" }
  - { value: "60%", label: "of trips where drivers left at a different time than usual" }
  - { value: "35%", label: "of trips where drivers changed both their departure time and their route" }
  - { value: "20%", label: "of travel time saved by drivers who changed their behavior" }
updated: 2026-10-27
---

## What problem does this research solve?

For decades the main answer to traffic congestion was to build more roads. That is expensive, and new lanes tend to fill up again as more traffic is induced. **Travel demand management (TDM)** takes the other route: change *when*, *how* and *whether* people travel, so existing roads carry the load more smoothly.

Most TDM programs, such as vanpooling, ridesharing, transit and teleworking, work for particular groups of commuters. They do little for the large group that drives alone and is unable or unwilling to give up the car. For those drivers, agencies have mostly used the **"stick"**: congestion pricing, toll lanes and parking charges. These can work, but they remain controversial, with open questions about socio-economic equity and about how efficiently road capacity is used.

A **"carrot"** is the alternative: reward drivers who leave outside the peak or take a less congested road. Earlier pilots, such as a 13-week Dutch program that paid drivers to avoid the morning rush, showed that rewards can change behavior. But those drivers were not told **how long their trip would take** if they left at a different time or took another route, so they had to rely on experience. Without that information, a driver cannot tell whether a change is worth it, and the time saved is unpredictable. The question this paper asks is whether a system that combines **accurate travel time predictions with rewards** can get everyday car commuters to change their habits, and whether those changes actually save them time.

## What did we do?

We built and field-tested **Metropia**, an *active demand management* platform for car commuters. A trip with Metropia has four steps:

1. **Discover.** Metropia's servers combine real-time and historical traffic data, plus incident reports, to predict traffic for the hours ahead and to find where the network has spare capacity. A routing algorithm then finds the fastest route for each future departure time.
2. **Reserve.** The app shows the driver several departure times, each with its predicted travel time and its reward ("trekpoints"). Departure times and routes that help the network more, because they avoid the peak or use a road with room to spare, earn more points. If too many Metropia drivers ask for the same alternative, the system lowers its reward. The driver reserves one option.
3. **Validate.** Ten minutes before the reserved time, the app reminds the driver to leave and switches on the phone's GPS. Turn-by-turn voice guidance keeps the driver on the reserved route. The trip counts only if the driver leaves within a set time window and follows the reserved route.
4. **Redeem.** Points are paid for validated trips and can be redeemed for discounted products and services, freebies or lotteries, or donated to charity.

<figure class="figure-narrow">
  <img src="/media/hu-incentive-adm-ijtst-2015/reserve-step.png" alt="Diagram of the Reserve step: a hand holding a smartphone next to a table of departure windows with travel time and reward. 7:00 to 7:15 am: 20 minutes, 100 points. 7:15 to 7:30 am: 25 minutes, 65 points. 7:30 to 7:45 am: 40 minutes, 20 points. 7:45 to 8:00 am: 1 hour 5 minutes, no reward" loading="lazy" />
  <figcaption>The Reserve step in the version of the app used in the pilot. Each 15-minute departure window comes with a predicted travel time and a reward: in this example, leaving at 7:00 am takes 20 minutes and earns 100 points, while leaving at 7:45 am takes over an hour and earns nothing. Image: from the paper.</figcaption>
</figure>

We ran a **10-week pilot in Los Angeles** from April to early July 2013. **36 commuters** took part (20 on Android, 16 on iPhone, both using the same servers). Most had professional backgrounds in transportation and drove to work every day, leaving home between 6 and 9 am and leaving work between 3 and 6 pm. When they signed up, they told us how much they could shift their departure time.

<figure>
  <img src="/media/hu-incentive-adm-ijtst-2015/departure-flexibility.png" alt="Stacked bar chart of how much the 36 participants could shift their departure. Morning, leave earlier: 6% no flexibility, 31% up to 15 minutes, 29% up to 30 minutes, 8% up to 60 minutes, 6% more than 60 minutes, 20% no response. Morning, leave later: 17% no flexibility, 34%, 17%, 6%, 6%, 20% no response. Afternoon, leave earlier: 23% no flexibility, 26%, 23%, 8%, 6%, 14% no response. Afternoon, leave later: 8% no flexibility, 31%, 29%, 3%, 9%, 20% no response" loading="lazy" />
  <figcaption>How far participants said they could move their departure time. Only 6% had no room to leave earlier in the morning, but 17% could not leave later; in the afternoon the pattern flips. So commuters were most willing to leave home earlier and to leave work later. Chart redrawn from the paper's survey results (Figure 2).</figcaption>
</figure>

To measure the two things that keep a driver using a system like this, we recorded two pairs of travel times for every trip:

- **Is the prediction right?** We compared Metropia's predicted travel time for the reserved trip with the travel time the driver actually experienced, measured from the phone's GPS. Only validated trips were used, so both times describe the same departure and the same route. We removed trips with obvious detours, such as stopping for coffee or dropping off children, and trips where the GPS kept recording after arrival.
- **Did the change save time?** After each trip, an automatic email survey asked the driver whether it was a regular trip, whether they had changed their usual departure time or route, and how long the trip normally took them. Comparing that **usual travel time** with the **experienced travel time** gives the time saved by changing behavior.

Over the 10 weeks, participants made **687 reservations** and completed **308 trips**.

## What are the key findings?

**1. The predictions were accurate, and stayed that way.** Trip by trip, the predicted travel times tracked the times drivers actually experienced closely. Over the whole pilot the **relative mean absolute error was 15.2%**. For comparison, the predictions of two other major navigation apps, recorded during the same field test, were off by about **30% and 40%**. The weekly error stayed between 10% and 18%.

<figure>
  <img src="/media/hu-incentive-adm-ijtst-2015/predicted-vs-actual.png" alt="Bar chart of travel time in minutes for about 280 trips. Black bars for the estimated travel time and red bars for the experienced travel time sit almost on top of each other; most trips take 10 to 40 minutes, a few up to 55" loading="lazy" />
  <figcaption>Predicted (black) and experienced (red) travel time for each validated trip. The two bars are close for most trips. Image: from the paper.</figcaption>
</figure>

<figure>
  <img src="/media/hu-incentive-adm-ijtst-2015/weekly-error.png" alt="Bar chart of relative mean absolute error by week, from week 1 (April 29 to May 5) to week 10 (July 1 to 7). Values range from about 11% to about 17.5%" loading="lazy" />
  <figcaption>Prediction error (RMAE) week by week. It stayed between 10% and 18% throughout the pilot. Image: from the paper.</figcaption>
</figure>

**2. Drivers changed their habits.** Compared with what they said they normally did, drivers:

- left at a **different time on 60%** of trips;
- took a **different route on 51%** of trips;
- changed **both on 35%** of trips.

Around 40% of trips left at the usual time, either because the driver had no flexibility or simply could not move. About half shifted by **15 minutes**, and about 10% shifted by more.

<figure>
  <img src="/media/hu-incentive-adm-ijtst-2015/departure-shift.png" alt="Bar chart of the share of trips by departure time shift in minutes. 0 minutes: about 38%. 15 minutes: about 50%. 30, 45, 60 and more than 60 minutes: each under 6%" loading="lazy" />
  <figcaption>How far drivers moved their departure time. Most changes were small, about 15 minutes. Image: from the paper.</figcaption>
</figure>

**3. Changing paid off.** Drivers who changed their behavior saved about **20%** of their travel time compared with their usual trip, and the weekly average saving ranged from about 10% to 40%. Moving the departure time saved more than changing the route alone, and drivers who changed both saved a little more still:

<figure>
  <img src="/media/hu-incentive-adm-ijtst-2015/time-saved-by-change.png" alt="Horizontal bar chart of average travel time saved. What the driver changed: departure time only 19.40%, route only 10.0%, both departure time and route 20.12%. Direction of the time shift: left earlier than usual 22.13%, left later than usual 19.32%. Time of day: morning commute 20.58%, afternoon commute 16.87%" loading="lazy" />
  <figcaption>Average travel time saved compared with the driver's usual trip, by what the driver changed. Leaving earlier saved the most (22.13%); changing the route alone still saved 10%. Chart drawn from the numbers in the paper.</figcaption>
</figure>

Route changes saving 10% is worth noting. Traffic models often assume that every driver already knows and uses the fastest route. In practice, a freeway can be jammed while a parallel arterial is nearly empty. A system that sees this and steers drivers onto the underused road makes better use of the roads a city already has.

## What can this be used for?

- **Transportation agencies.** Incentives offer a "carrot" alternative, or a complement, to congestion pricing for car commuters, the group that most TDM programs miss. Rewards can be targeted at the departure times and routes where moving a few drivers helps the most.
- **Designers of incentive programs.** Rewards alone are not enough: drivers need reliable predictions to know that a change is worth making. Both the accuracy of the predictions and the time actually saved give drivers their own reason, beyond the points, to keep the new habit.
- **Traffic modelers.** Real drivers do not all know the fastest route. Measured time savings from route changes alone show how much an information system can do to balance traffic between jammed and underused roads.

The paper also points to an open question: how to pay for the rewards so the program is market-driven and financially sustainable. Metropia pictured the answer as an ecosystem.

<figure class="figure-narrow">
  <img src="/media/hu-incentive-adm-ijtst-2015/metropia-ecosystem.jpg" alt="Illustration of a phone showing the Metropia logo inside a ring of icons labeled rewards, surrounded by commuter, local community, business partner and transportation agency" loading="lazy" />
  <figcaption>Metropia's picture of a reward ecosystem that links commuters, local communities, business partners and transportation agencies. Image: Metropia, Inc.</figcaption>
</figure>

This pilot was small, 36 commuters over 10 weeks, and was a first test of the idea. A later study followed **157 Metropia users in Austin, Texas, over more than 11,000 trips** to see how departure habits change trip by trip: read the plain-language summary of [*Will Information and Incentive Affect Traveler's Day-to-Day Departure Time Decisions?*](/hu-departure-time-ijst-2020/)
