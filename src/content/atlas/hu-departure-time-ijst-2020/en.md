---
tldr: >-
  We followed 157 Austin drivers trip by trip as they started using Metropia, a navigation app that
  pays reward points for leaving at less congested times, and found that their departure times settle
  into a new habit over repeated trips, and that accurate travel time predictions, past time savings,
  reward points and schedule flexibility all shape whether a commuter leaves at the same time tomorrow.
hero:
  image: /media/hu-departure-time-ijst-2020/metropia-app.jpg
  alt: >-
    Three phone screens from the Metropia app in Austin. The first two show a route map and a table of
    departure times: leaving at 6:45 am takes 27 minutes and earns 70 points, 7:00 am takes 33 minutes
    and earns 30 points, and 7:15 am takes 38 minutes and earns 20 points. The third screen says
    "You Have Arrived!" with 70 points earned
  caption: >-
    How the app nudges a commuter. Before the trip it shows the predicted travel time and the reward
    points for each 15-minute departure slot (left: 6:45 am, 27 minutes, 70 points; middle: 7:00 am,
    33 minutes, only 30 points). If the driver really leaves at the reserved time, the points are paid
    on arrival (right).
  credit: Metropia app screenshots, from the paper
affiliations:
  - Missouri University of Science and Technology
  - Metropia, Inc.
  - University of Arizona
author_affiliations: [[1], [2], [3], [1]]
abstract: |-
  The uncertainty and unpredictability of a transportation network roots in the dynamics of individual travel behavior, which can be revised consciously or repeated habitually depending upon the reality and personality. In this paper, we propose to study the day-to-day departure time choice behavior of the travelers, using real observation data collected from a smartphone app, "Metropia". Influenced by the information and incentives provided in the app and the comparison with the experience gained from the last trip, a transformation process of traveler's day-to-day experience on departure time from an existing habit to a new one is analyzed in this study. The analysis result in a binary choice model for the shift of departure time for each repeated morning commute trip comparing with the last one, which proves that users' experience in app engagement, previous travel time saving, habitual travel time, incentives, and commute flexibility are able to trigger day-to-day behavioral change for their morning home-to work commutes. The findings of this research provide insights on the users' adaption to a new traffic information service along with incentives, and corresponding behavior changes over a transition period. The outcomes suggest ways to improve ICT services and incentive scheme, as well as the transportation operation and demand management.
key_numbers:
  - { value: "11,709", label: "trips by 157 frequent app users in Austin, each followed from their first day" }
  - { value: "45.7%", label: "of morning commutes left within 5 minutes of the previous day's departure" }
  - { value: "88%", label: "of regular commuters (64 of 73) varied their morning departure by more than 30 minutes" }
  - { value: "76.4%", label: "of held-out trips where the model correctly predicted “same time” or “different time”" }
updated: 2026-10-27
---

## What problem does this research solve?

Rush-hour congestion is, at heart, the sum of millions of small decisions about **when to leave home**. Each commuter makes that choice again every morning. Some days it is pure habit; other days it changes because yesterday's drive was slow, a traffic app predicted a jam, or something else in the person's day moved. Because so much traffic comes from these repeated choices, understanding how they shift from one day to the next is one of the central questions in travel behavior research.

Smartphones have added two new forces to that daily decision. **Information**: apps now predict how long a trip will take if you leave at 7:00 rather than 7:15. **Incentives**: some programs reward drivers who avoid the peak, with points, lotteries, free transit tickets or gift cards. Together, they promise to turn passive traffic information into an active **travel demand management** tool that spreads trips away from the busiest minutes.

But when someone starts using such an app, how do their habits actually change? Do they keep experimenting, or do they settle on a new departure time? Which experiences push them to switch, and which make them stick? Almost all earlier studies of departure time choice relied on mathematical formulations or simulation, each built on its own assumptions. **Continuous, real-world observation of how drivers adapt to an information-and-incentive app, trip after trip, was missing.** This paper fills that gap.

## What did we do?

We studied **Metropia**, a smartphone app in Austin, Texas, that combines traffic prediction with rewards. When a driver plans a trip, the app shows the predicted travel time for each 15-minute departure slot and the **reward points** offered for it: fewer points for slots that are heavily congested, more for off-peak slots. If the driver really leaves at the reserved time and follows the suggested route, the trip is validated and the points, which can be redeemed for gift cards, are added to the account. Every trip is logged: origin, destination, departure time, the predicted and the actual travel time, and the points earned.

We randomly selected **157 frequent users** who signed up between May and November 2015 and made more than 50 trips each in that period, so that their behavior could be followed **from their very first day with the app**. In total they made **11,709 trips**. Using the places each person traveled between most often, we split them into **132 commuters** and **25 non-commuters**, and sorted their trips into four groups: commuter home-to-work trips, work-to-home trips, other commuter trips, and non-commuter trips.

<figure class="figure-row">
  <img src="/media/hu-departure-time-ijst-2020/od-commuter.png" alt="3D plot with longitude and latitude on the floor and time rising upward. Red lines zigzag between the same two points over and over, forming a dense vertical sheet" loading="lazy" />
  <img src="/media/hu-departure-time-ijst-2020/od-noncommuter.png" alt="The same kind of 3D plot for a non-commuter: red trip lines bunch around one area but go to many different places, with no single repeated pair" loading="lazy" />
  <figcaption>Each red line is one trip, drawn from its origin to its destination on a map (the floor of the box), with time rising upward over the months. Left: a typical commuter shuttles between the same two places again and again. Right: a typical non-commuter's trips are far less regular. Images: from the paper.</figcaption>
</figure>

The commuter trips behave as expected. **89.1%** of home-to-work trips were the first trip of the day, and the median stay at work before the next trip was **7.6 hours**. Plotting each person's first 20 trips on their most common route already shows the difference between trip types: morning commutes cluster tightly between 6 am and 10 am, evening commutes spread between 3 pm and 7 pm, and other trips show no stable pattern at all.

<figure>
  <img src="/media/hu-departure-time-ijst-2020/first-20-departures.png" alt="Four stacked line charts of departure time of day (0 to 24 hours) against trip number 1 to 20, one line per traveler. Home-to-work lines form a dense, mostly flat band around 7 to 8 am. Work-to-home lines form a band around 4 to 6 pm with some spikes. Other commuter trips and non-commuter trips are scattered across the day" loading="lazy" />
  <figcaption>Departure time for each traveler's first 20 trips on their most frequent route, by trip type (top to bottom: commuter home to work, work to home, other commuter trips, non-commuter trips). Flat lines mean a stable habit. Image: from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

Instead of asking “what time does this person leave?”, we asked a question that matches how habits change: **compared with the last time this person made this same trip, did they leave at the same time or not?** Each morning commute was compared with the previous one between the same home and workplace. If the new departure was within 5 minutes of the old one, it counted as “same time”; otherwise it counted as a shift.

We then tested which experiences predict a shift. Following the paper's hypotheses, drivers decide based on their past experience and on the information in front of them, and the reward scheme can tip the decision. The candidate factors were:

- **App accuracy last time:** how close the app's predicted travel time was to the travel time the driver actually experienced on the previous trip.
- **Time saved last time:** whether the previous trip beat its prediction by more than 5 minutes.
- **A tempting new prediction:** whether the predicted travel time for today's departure is more than 3 minutes shorter than what the driver actually experienced last time.
- **Reward points:** the change in points offered today compared with the points earned last time.
- **Schedule flexibility:** whether the commuter's morning departures, over the whole study, spread by more than 30 minutes.

We compared three models on this question: a **binary logit** (same time vs. shift), a **multinomial logit** (same time, earlier, or later), and a **random-effects model** that allows each person's decisions to be correlated. The random-effects model did no better than the plain binary logit, so the binary logit was used as the main model and the multinomial logit to tell earlier shifts from later ones.

## What are the key findings?

**1. New habits form, and commutes settle fastest.** For each trip number, we measured how much travelers' departures shifted from their previous trip on the same route. That spread **shrinks as the trips repeat**: drivers experiment early on and then converge on a stable departure time. Home-to-work trips converge somewhat faster than non-commuter trips, which have more freedom in when they happen.

<figure>
  <img src="/media/hu-departure-time-ijst-2020/departure-shift-convergence.png" alt="Scatter plot of standard deviation of the departure time shift against repeated trip number from 0 to 100. Triangles for home-to-work trips and crosses for non-commuter trips start near 14 to 15. A solid trend line for home-to-work trips falls to about 7 by trip 100; a dotted line for non-commuter trips falls more slowly and stops near trip 50" loading="lazy" />
  <figcaption>The spread (standard deviation) of trip-to-trip departure shifts, by how many times the trip has been repeated. Both lines slope down, so departure times stabilize with experience; the solid home-to-work line falls faster than the dotted non-commuter line. Image: from the paper.</figcaption>
</figure>

**2. Most commuters can move.** Looking only at morning trips (4 am to 10 am), just **9 of the 73 regular commuters (about 12%)** never varied their departure by more than 30 minutes. The other **64 (88%)** did, which makes them the natural audience for programs that try to move trips out of the peak.

<figure>
  <img src="/media/hu-departure-time-ijst-2020/fixed-vs-flexible.png" alt="Two line charts of morning departure time (4 to 10 am) over 20 repeated trips. The top chart has a few nearly flat lines between 6 and 9.5 am. The bottom chart has dozens of lines that cross and wiggle across the whole 5 to 10 am range" loading="lazy" />
  <figcaption>Morning home-to-work departures over 20 repeated trips. Top: the 9 commuters with a fixed schedule, whose departures stay within 30 minutes. Bottom: the 64 commuters with a flexible schedule. Image: from the paper.</figcaption>
</figure>

**3. Habit is strong, but switching is common.** In **45.7%** of morning commutes, drivers left within 5 minutes of their previous departure. The rest split almost evenly between leaving earlier and leaving later.

<figure>
  <img src="/media/hu-departure-time-ijst-2020/next-trip-shares.png" alt="Bar chart. Same time as last trip (within 5 minutes): 45.7%. Earlier: 26.5%. Later: 27.8%" loading="lazy" />
  <figcaption>What drivers did on each morning commute compared with their previous one on the same route. Chart drawn from the paper's multinomial logit results.</figcaption>
</figure>

**4. Five factors shape tomorrow's departure.** In the binary model, five factors were linked to sticking with or leaving the previous departure time:

- **Trust earned by accurate predictions.** When the app's prediction for the last trip was close to reality (the trip took between 2 minutes longer and 3 minutes less than predicted), drivers were more likely to leave at the same time again. When it was off, they were more likely to change, and the multinomial model shows they tended to **leave earlier**.
- **A good trip is worth repeating.** If the previous trip saved more than 5 minutes of travel time, the driver was more likely to keep that departure time. Smaller savings led drivers to keep looking.
- **Tolerance for small delays.** Drivers switched when the app predicted that today's departure would be **more than 3 minutes faster** than what they actually experienced last time, and in that case they more often **left later**. Smaller differences did not move them, which points to some tolerance for a habitual, slightly longer trip.
- **Rewards help habits stick.** When more points were offered for today's trip than were earned last time, drivers were more likely to keep their departure time. Points worked the same way for earlier and later shifts.
- **Flexibility is the strongest factor.** Commuters with flexible schedules were far more likely to shift, and equally likely to shift earlier or later.

The time-saving, new-prediction and flexibility effects were statistically significant at the 5% level or better; the accuracy and reward effects were weaker, significant at the 10% level.

When the binary model was trained on about 2,000 home-to-work trips and tested on **496 trips it had not seen**, it correctly predicted whether the driver would keep or change their departure time for **379 of them (76.4%)**. The model's overall fit was modest (McFadden R² = 0.020), so these factors shift the odds of switching rather than fully explaining any one morning's choice.

## What can this be used for?

- **Traffic information apps.** Accurate predictions are not just a feature; they are what lets a new departure habit form. A bad prediction sends drivers looking for a different time, often an earlier one.
- **Travel demand management programs.** Most commuters in the sample had room to shift. Rewards and information that help them find a less congested departure, and then reward them for sticking with it, can turn a one-time shift into a lasting habit.
- **Program designers.** Habits change most in the first trips after someone joins, before departure times settle. That early window is when information and incentives have the most room to work.
- **Travel demand modelers.** Trip-by-trip data from real app users show how travelers learn from experience, which can improve short- and long-term travel demand forecasts.

Future work will test these models with more users and more trips, and extend the analysis to the other main daily decision the same data can track: **route choice**.
