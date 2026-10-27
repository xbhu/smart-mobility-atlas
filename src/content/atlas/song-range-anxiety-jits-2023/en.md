---
tldr: >-
  We used 208,187 public charging sessions from Kansas City to learn at what battery level EV drivers
  plug in, a measurable sign of range anxiety; a gradient-boosting model predicts it more accurately
  than linear regression or a random forest, sets up 23 times faster than the random forest, and shows
  that drivers' own habits and battery size matter most.
hero:
  image: /media/song-range-anxiety-jits-2023/battery-at-plug-in.png
  alt: Bar chart of the battery level at which charging sessions started, in ten bins from 0–10% to 90–100%, each drawn as a battery icon; under 1% of sessions start below 10% and 1% at 10–20%, then the share rises to a peak of 18% at 70–80% before dropping to 5% at 90–100%
  caption: >-
    Battery level at the start of public charging sessions in Kansas City. Fewer than 2 in 100
    sessions began below 20%, and the most common starting level was 70–80%: most drivers plug in
    long before the battery runs low. Chart redrawn from the paper's Figure 10b (training data), with
    bar heights read from the figure.
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  This manuscript focuses on the modeling of electric vehicle (EV) driver's range anxiety, a fear that a vehicle does not have sufficient range, or state of charge (SOC) of the battery pack, to reach its destination and would strand its occupants. Despite numerous research studies on the modeling of charging behaviors, modeling efforts to understand at what battery percentages do EV drivers charge their vehicles, and what are the associated contributing factors, are rather limited. To this end, an ensemble learning model based on gradient boosting is developed. The model sequentially fits new predictors to new residuals of the previous prediction and, then, minimizes the loss when adding the latest prediction. A total of 18 features are defined and extracted from the multisource data, which cover information on driver, vehicles, stations, traffic conditions, as well as spatial-temporal context information of the charging events. The analyzed dataset includes 4.5-year's charging event log data from 3,096 users and 468 public charging stations in Kansas City Missouri, and the macroscopic travel demand model maintained by the metropolitan planning organization. The result shows the proposed model achieved a satisfactory result with a R square value of 0.54 and root mean square error of 0.14, both better than multiple linear regression model and random forest model. To reduce range anxiety, it is suggested that the priorities of deploying new charging facilities should be given to the areas with higher daily traffic prediction, with more conservative EV users or that are further from residential areas.
key_numbers:
  - { value: "208,187", label: "charging sessions from 3,096 drivers at 468 public stations in Kansas City" }
  - { value: "0.54", label: "R² on held-out data, versus 0.26 for linear regression and 0.53 for a random forest" }
  - { value: "23×", label: "faster to set up than the random forest (26 vs. 614 minutes)" }
  - { value: "±11 pts", label: "typical prediction error in battery level (mean absolute error 0.11)" }
updated: 2026-10-27
---

## What problem does this research solve?

**Range anxiety** is the fear that an electric vehicle (EV) does not have enough charge left to reach its destination and will leave its occupants stranded. It is one of the biggest barriers to wider EV adoption, and charging an EV takes far longer than filling a gas tank, so running low is a real cost.

Many studies have looked at where and when EV drivers charge. Far fewer have asked a simpler question: **at what battery level do drivers decide to plug in, and what makes them do it earlier or later?** Phone users offer an analogy. Some plug in whenever they can, no matter how full the battery is; others wait until it is nearly empty. One study of smartphone users found that the "light consumers" did not start a charge until their battery had dropped to 34% on average.

Earlier EV research had to study range anxiety indirectly: through simulated trips, stated-preference surveys, or an assumed formula linking battery level to anxiety that "still needed further justification." This paper takes a direct, data-driven route. It treats the battery level at the start of each real charging session, the **initial state of charge (SOC)**, as a measurable sign of range anxiety: a driver who plugs in at 80% is more cautious than one who waits until 20%. It then learns which factors push that number up or down.

## What did we do?

We combined two data sets from Kansas City, Missouri:

- **Charging logs** from 468 public charging stations, recorded between 2014 and 2019: 208,187 charging sessions from 3,096 users, each with the station, start and end time, energy delivered and user ID. Most stations sit in the downtown area.
- **The regional travel demand model** of the Mid-America Regional Council (MARC), the metropolitan planning organization: 2,510 traffic analysis zones, the daily trip table between them, and traffic volumes on 24,601 road links.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/kansas-city-stations.jpg" alt="Two Google maps of Kansas City, Missouri, with green markers for public charging stations; the left map shows the whole city with markers spread out, the right map zooms into downtown where the markers are densely packed" loading="lazy" />
  <figcaption>The public charging stations in the data set: the whole city (left) and downtown, where most of them are (right). From the paper (Figure 3); map data: Google.</figcaption>
</figure>

From these sources we built **18 features** that describe each charging session: who the driver is and how they usually charge, the vehicle, the station, nearby traffic, the time and the type of place. Two of them had to be inferred:

- **Battery size** is not in the logs. For each car with at least 10 recorded sessions, we took the largest single charge as a lower bound and matched it to the closest larger battery among popular models such as the Nissan Leaf, BMW i3, Chevrolet Bolt, Hyundai Kona and Ford Focus Electric.
- **How cautious a driver is** is measured by how often they charge: the number of sessions divided by the number of days they used the network. Other things being equal, drivers who charge less often are taking more risk.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/features-en.png" alt="Diagram of six colored boxes listing the 18 features: driver (4), time (6), traffic (2), vehicle (1), station (1) and place (4), with an arrow to a box saying gradient-boosted trees predict the battery level when charging starts" loading="lazy" />
  <figcaption>The 18 features in six groups. The model uses them to predict the battery level when a session starts. Drawn from Table 1 of the paper.</figcaption>
</figure>

Drivers turned out to be very different from each other. About half of them charged at public stations 0–0.2 times a day, that is, at most once every five days, while fewer than 5% charged more than once a day.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/charging-frequency-en.png" alt="Histogram of drivers' public charging frequency from 0 to 1.4 charges per day; the first two bins, 0 to 0.2 charges per day, are highlighted and hold about 26% and 28% of drivers, and the bars fall off steeply after that" loading="lazy" />
  <figcaption>How often drivers charge at public stations, per day. The steep drop-off shows how much charging habits vary, which is why charging frequency is one of the model's features. Redrawn from the paper's Figure 1, with bar heights read from the figure.</figcaption>
</figure>

## What is the key methodological contribution?

**Filling in the missing battery levels.** Only 16,286 of the 208,187 sessions record the starting battery level directly. Whether a charger reports the battery level at all depends on its plug: sessions on "Combo" plugs report the battery level at the end, while sessions on J1772 and NEMA 5-20R plugs do not. We recovered the starting level in two ways:

1. **When the end level is known**, work backwards: subtract the energy delivered, divided by the battery size, from the end level.
2. **When it is not**, find sessions that ended with a full battery and use 100% as the end level. The logs record both how long a car was plugged in and how long it actually drew power. If the car stayed plugged in well after power stopped flowing, the charger stopped because the battery was full.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/plug-out-gap-en.png" alt="Bar chart of how long cars stayed plugged in after charging stopped: 39% under 50 seconds, 3% at 50–100 seconds, 7% at 100–150 seconds, then 2–4% in each bin up to 67 minutes, and 38% over 67 minutes; a dashed line at 150 seconds separates sessions treated as not full from those treated as full charges" loading="lazy" />
  <figcaption>Time between the end of charging and the car leaving the charger. About 40% of cars leave within 50 seconds; another 40% stay plugged in for more than an hour after charging stops. We treat a gap of more than 150 seconds (2.5 minutes) as a sign of a full battery. The bins are not equal in width. Redrawn from the paper's Figure 2, with bar heights read from the figure.</figcaption>
</figure>

With both steps, 33,426 sessions had a known or inferred starting battery level for training, validating and testing the model.

**A fast, regularized boosting model.** Following the XGBoost approach, the model builds thousands of small decision trees one after another. Each new tree learns the error left by the trees before it, and the prediction is their sum. The training goal adds a penalty on how complex each tree is, so the model fits the data well without memorizing it. After tuning, the best model uses 4,300 trees with a maximum depth of 8.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/boosting-en.png" alt="Diagram: tree 1 makes a rough first guess, tree 2 learns only the error tree 1 left, tree 3 learns what is still left, and so on; the prediction is the sum of 4,300 small trees" loading="lazy" />
  <figcaption>How gradient boosting works. Because each tree corrects the previous ones, the error drops steadily as trees are added, without the ups and downs of a random forest.</figcaption>
</figure>

## What are the key findings?

**Most drivers plug in long before the battery runs low.** In the training data, almost no session started below 10% and fewer than 2 in 100 started below 20%. The most common starting level was 70–80%, and roughly seven in ten sessions began with at least half the battery left (see the chart at the top of the page).

**The model predicts the starting battery level reasonably well.** On held-out test data it explains 54% of the variation (R² = 0.54), with a typical error of about 11 percentage points of battery level (mean absolute error 0.11; RMSE 0.14). Training and test accuracy are close, so the model is not overfitting. Its errors are largest for sessions that start below 20%, simply because so few drivers wait that long and the model has little data to learn from.

**It beats two benchmark models, and sets up far faster than the random forest.** Linear regression reached an R² of only 0.26 on the same test data; a random forest reached 0.53. The boosting model was also more efficient: tuning and training took 26 minutes in total, against 614 minutes for the random forest, 23 times faster. Training alone took 0.37 minutes instead of 9.21, a 96% reduction.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/comparison-en.png" alt="Two bar charts. Accuracy on held-out data as R squared: linear regression 0.26, random forest 0.53, our boosted model 0.54. Time to set up: linear regression 0.27 seconds, random forest 614 minutes, our boosted model 26 minutes" loading="lazy" />
  <figcaption>Accuracy and setup time of the three models after each was tuned to its best settings. Linear regression is instant but much less accurate. Chart drawn from Tables 6 and 7 of the paper.</figcaption>
</figure>

**Who the driver is matters more than where they are.** The three most important features describe the driver and the car: how often the driver charges, how far the charger is from home, and the battery size. Drivers who charge more often, and cars with bigger batteries, tend to plug in at a higher battery level. Traffic around the station comes next, then the density of charging stations and charging at night. The top seven features account for 93.64% of the model's total feature importance. Charging decisions are driven mostly by drivers' own habits and vehicles, while context such as traffic and charger availability plays a smaller role.

<figure>
  <img src="/media/song-range-anxiety-jits-2023/importance-en.png" alt="Horizontal bar chart of relative feature importance: daily charging frequency 100, distance from charger to home 94, battery size 86, trip production nearby 57, average daily traffic nearby 56, charging station density 34, charging at night 26, public station in home zip code 7, charging in home zip code 4, charger in a business area 4" loading="lazy" />
  <figcaption>The ten most important features, scaled so the top one is 100. Driver and vehicle features (navy, teal) lead; traffic (orange) and station density (purple) follow. Drawn from Table 5 of the paper.</figcaption>
</figure>

## What can this be used for?

The results point to three kinds of places where new public chargers would do the most to ease range anxiety:

- **Areas that generate or attract many trips.** Trips that start or end nearby (trip production) mattered slightly more than total traffic (AADT), which also counts through traffic that never stops. Planners should look at where people actually go, not just at busy roads.
- **Areas farther from where people live.** Distance from home was the second most important feature, so chargers away from residential areas are where anxious drivers need them.
- **Areas with more cautious EV drivers.** Drivers who charge often plug in early, so areas where such drivers are common should get more charging capacity.

For researchers, the paper shows how to measure range anxiety from charger logs that cities and charging operators already have, instead of assuming a formula or relying on surveys. The same Kansas City charging logs later fed the lab's work on [where to build new charging stations](/song-charging-station-location-trd-2023/) and the city's [streetlight chargers](/pan-streetlight-charging-jupd-2025/).

<figure>
  <img src="/media/song-range-anxiety-jits-2023/ev-streetlight-car.jpg" alt="An electric car plugged into a charger mounted on a streetlight pole on a city street" loading="lazy" />
  <figcaption>A streetlight charger in Kansas City, Missouri. The lab later drew on the city's charging logs to help decide where chargers like this one should go. Photo: provided by XB Hu/Penn State.</figcaption>
</figure>

This work was supported by the U.S. Department of Energy's Vehicle Technologies Office (Award DE-EE0008474), with support from the Metropolitan Energy Center, the City of Kansas City, Missouri, Lilypad, the Mid-America Regional Council and Evergy.
