---
tldr: >-
  We built a two-stage model that first learns how busy a charging station will be and then picks
  new station sites by their effect on the whole network, existing stations included; in Kansas
  City it raised weekly charging use by 14% over a random plan and beat two benchmark methods.
hero:
  image: /media/song-charging-station-location-trd-2023/initial-vs-optimized-sites.jpg
  alt: Two maps of Kansas City, Missouri, side by side, each with 50 dots for new charging stations colored from yellow (low use) to dark blue (high use); the random plan on the left is mostly yellow, the optimized plan on the right is darker and clustered toward the urban core
  caption: >-
    The same budget of 50 new stations in Kansas City, placed at random (left) and by our model
    (right). Darker dots mean more predicted charging events per week; the optimized sites carry
    about twice the use. From the paper (Figure 9), with labels added.
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  We present a learning-based, demand-supply-coupled optimization model for the charging station location problem (CSLP), aiming to integrate the concept of electric vehicle (EV) charging demand management into the planning of charging infrastructures. In stage one, a gradient boosting-based learning model is developed to predict the charging demand of a charging station based on 15 defined features. Next, in stage two, a demand-supply-coupled CSLP model is developed to optimize the total charging usage rates of both existing and newly selected charging stations. We design a gradient-based stochastic spatial search algorithm to solve the proposed model. A case study with 6-year charging event data from Kansas City Missouri is performed. Results show that the proposed method can generate satisfactory charging demand predictions, and can increase charging usage rates by 14%, outperforming two benchmark approaches. The results of this research are poised to guide agencies in identifying optimal locations for new charging stations.
key_numbers:
  - { value: "+14%", label: "weekly charging events across all 494 stations, versus a random siting plan" }
  - { value: "0.63", label: "R² of the demand model on held-out data (0.20–0.40 for linear regression, KNN and neural network)" }
  - { value: "444", label: "existing public stations in Kansas City, with six years of charging logs" }
  - { value: "50 of 355", label: "new sites chosen from candidate locations across 71 zip codes" }
updated: 2026-10-25
---

## What problem does this research solve?

A city or utility with money for a few dozen new EV chargers has to decide where to put them. The textbook approaches to this "charging station location problem" need things planners rarely have. Flow-based models start from an origin-destination table of EV trips, which requires knowing where EV owners live and where they drive. Node-based models measure a site by how much area it covers, not by how many cars will actually plug in. Neither gives the number decision makers ask for first: **how many charging sessions will this station see each week?** That number drives how many plugs to install, what revenue to expect and how much load the grid must carry.

There is a second, subtler problem. Chargers change where EV drivers go: drivers favour destinations that offer charging, and a new station can pull demand away from nearby stations or make a whole area more attractive. So the stations already in the ground and the ones about to be built **cannot be judged one at a time**. Picking the 50 sites with the highest individual forecasts ignores how they affect each other and the existing network.

By the late 2010s Kansas City, Missouri, already had 444 public charging stations, concentrated downtown. The question there was not where to put the first chargers but how to add more without simply splitting the same drivers across more plugs.

## What did we do?

We worked with six years (2014–2019) of charging logs from those 444 public stations, the regional travel demand model from the Mid-America Regional Council (2,510 traffic analysis zones), and daily weather records from NOAA's National Centers for Environmental Information. Combined, they gave 67,576 station-week records, each describing one station in one week.

<figure class="figure-row">
  <img src="/media/song-charging-station-location-trd-2023/existing-stations-map.png" alt="Map of Kansas City zip code areas with 444 existing charging stations as dots, most of them yellow and clustered in the downtown core, a few darker blue" loading="lazy" />
  <img src="/media/song-charging-station-location-trd-2023/candidate-sites-map.png" alt="Map of Kansas City zip code areas covered with green dots marking 355 candidate charging station sites spread across the whole city" loading="lazy" />
  <figcaption>Left: the 444 existing public stations, colored by weekly use; most sit downtown, and most see fewer than ten charging events a week. Right: the 355 candidate sites, five points of interest in each of 71 zip codes, from which 50 new stations are to be chosen. From the paper.</figcaption>
</figure>

The model has two stages that feed each other:

- **Stage one predicts demand.** A gradient-boosting ensemble model learns the weekly number of charging events at a station from 15 features: how many stations already sit per square mile in the same zip code, the parcel's land use (seven types), charger type (Level 2 or DC fast), weekly temperature, rainfall and wind, nearby traffic volume (AADT), and trips produced in the area. Because it learns from what drivers actually did, it does **not need an EV origin-destination table**.
- **Stage two chooses sites.** It selects 50 of the 355 candidates so that the **total** weekly charging events at all 494 stations, existing and new, is as high as possible, with at most three new stations in any one zip code.

<figure>
  <img src="/media/song-charging-station-location-trd-2023/two-stage-framework.png" alt="Flow chart: charging logs, travel demand model data and weather data feed an ensemble learning model (stage one), which feeds a demand-supply coupled location model solved by a gradient-based stochastic spatial search (stage two), followed by the case study" loading="lazy" />
  <figcaption>The two-stage framework. Three data sources train the stage-one demand model; stage two uses it inside a search over candidate sites. From the paper.</figcaption>
</figure>

## What is the key methodological contribution?

The link between the two stages is **station density**: the number of charging stations per square mile in a zip code. It is one of the inputs to the demand model, and it is also exactly what changes when a new station is built. That makes demand and supply coupled: every time the plan adds a station, the predicted use of every station in that zip code shifts, up or down.

The paper's SHAP analysis confirms that density matters. Nearby traffic and trip production are the two strongest predictors of weekly use, followed by commercial land use, and **station density ranks fourth**.

<figure class="figure-row">
  <img src="/media/song-charging-station-location-trd-2023/prediction-accuracy.png" alt="Bar chart of the demand model's R squared, RMSE and MAE on training and testing data: R squared 0.72 and 0.63, RMSE 2.38 and 2.77, MAE 1.62 and 1.85" loading="lazy" />
  <img src="/media/song-charging-station-location-trd-2023/shap-feature-importance.png" alt="Horizontal bar chart of mean SHAP values for the ten most important features, led by AADT, trip production, commercial land use and neighbouring station density" loading="lazy" />
  <figcaption>Left: the stage-one model explains 72% of the week-to-week variation in station use on training data and 63% on held-out data, with a typical error of under two charging events a week (MAE 1.85). Right: the features that matter most; NHCS, the density of nearby stations, is fourth. From the paper.</figcaption>
</figure>

To exploit that coupling, we designed a **gradient-based stochastic spatial search**. It starts from a random plan and repeatedly tries swapping one chosen site for another candidate. After each trial swap it recomputes station densities, re-predicts weekly use at all 494 stations and keeps the swap that raises the network total the most. Most trial swaps stay in the same or a neighbouring zip code, but a few faraway candidates are drawn at random so the search does not get stuck near its starting point; their number shrinks as the search settles.

<figure>
  <img src="/media/song-charging-station-location-trd-2023/stage-two-loop-en.png" alt="Diagram of four steps in a loop: try swapping one new site, update station density, re-predict demand at all 494 stations, keep the swap only if the network total rises; repeat until the total stops improving" loading="lazy" />
  <figcaption>How stage two scores a plan. Step 2 is where supply feeds back into demand: a new station changes the density that the demand model sees for every station around it.</figcaption>
</figure>

## What are the key findings?

**The search converges quickly.** Starting from a random plan with 1,278 charging events a week across all stations, it reached 1,459 after eight iterations, and the total barely changed after the third.

**It picks better sites, and it helps the existing stations too.** Total use across all 494 stations rose by **14%** over the random plan. The random plan's 50 new stations would see 125 charging events a week; the optimized 50 see 264. Use of the 444 existing stations also rose, from 1,153 to 1,195 a week (+3.5%), so the new stations add to the network rather than just splitting the same drivers. The optimized sites cluster: 18 zip codes get two new stations and one gets three, mostly toward the urban core where demand is higher.

<figure>
  <img src="/media/song-charging-station-location-trd-2023/results-comparison-en.png" alt="Three bar charts of weekly charging events for four siting methods. Existing 444 stations: random 1,153, greedy 1,163, neighbor swap 1,195, our model 1,195. 50 new stations: 125, 266, 256, 264. All 494 stations: 1,278, 1,429, 1,451, 1,459" loading="lazy" />
  <figcaption>Weekly charging events under four ways of choosing the same 50 sites. The greedy method, which takes the 50 sites with the highest individual forecasts, wins on the new stations alone but helps the existing ones least. Our coupled model gives the highest total. Chart drawn from the numbers in the paper.</figcaption>
</figure>

**It beats two benchmark methods on the network total.** A greedy method that picks the 50 sites with the highest individual forecasts, which is what demand prediction alone would suggest, reached 1,429 events a week. A neighbor-swap method that, like earlier adaptive large neighborhood search approaches, only searches nearby zip codes reached 1,451. Our model reached 1,459, ahead by 2% and 0.5%. The greedy plan's new stations were actually slightly busier (266 vs. 264 a week), but it raised existing stations' use by only 0.9%. **Judging sites one at a time leaves network-wide use on the table.**

**The advantage holds, and grows, as the budget grows.** We varied the number of new stations from 30 to 110. Our model came out on top in every case, from 1,370 to 1,636 charging events a week, and its lead over the greedy method widened as more stations were added, because more new stations means more interaction among them and with the existing network.

<figure>
  <img src="/media/song-charging-station-location-trd-2023/sensitivity-new-stations.png" alt="Line chart of weekly charging events versus number of new charging stations from 30 to 110 for four methods; the proposed method is highest throughout, and the gap to the greedy method widens as the number of stations grows" loading="lazy" />
  <figcaption>Total weekly charging events as the number of new stations grows from 30 to 110. Orange (our model) stays on top; the gap to green (greedy) widens with larger budgets. From the paper.</figcaption>
</figure>

## What can this be used for?

- **Cities, utilities and state DOTs expanding a charging network** that already exists: the model ranks candidate sites by how much they add to total use across the network, existing chargers included, rather than by each site's own forecast.
- **Planners without EV trip data:** it runs on data agencies typically have or can get, namely charger session logs, a regional travel demand model, land use and public weather records, and it gives an explicit forecast of weekly charging sessions per station that can inform plug counts, revenue estimates and grid planning.
- **Kansas City's own deployment:** the model supported the City of Kansas City, Missouri, in planning new charging stations, and the same kind of demand model was later used to choose sites for the city's [streetlight chargers](/pan-streetlight-charging-jupd-2025/).

This work was supported by the U.S. Department of Energy's Vehicle Technologies Office (Award DE-EE0008474), with support from the Metropolitan Energy Center, the City of Kansas City, Missouri, Lilypad, the Mid-America Regional Council and Evergy.
