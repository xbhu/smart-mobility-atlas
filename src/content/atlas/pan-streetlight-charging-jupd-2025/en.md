---
tldr: >-
  We built an equity-focused framework for choosing which streetlights to turn into EV chargers, used
  it to place 23 chargers in Kansas City, Missouri, and found over a year of use that each charging
  session avoided about 12% more gasoline than at regular stations.
hero:
  image: /media/pan-streetlight-charging-jupd-2025/streetlight-charger-car.jpg
  alt: A small blue electric car parked at the curb on a city street, plugged into a charger mounted on a streetlight pole
  caption: A curbside streetlight doubles as a Level 2 EV charger, so drivers without a garage can charge where they already park.
  credit: Provided by XB Hu/Penn State
affiliations:
  - The Pennsylvania State University
  - ElectroTempo, Inc.
author_affiliations: [[1], [2], [1], [1], [1]]
abstract: |-
  With an increasing global emphasis on sustainability, electric vehicles (EVs) play a crucial role in reducing urban pollution and carbon emissions. For EVs to be widely adopted, equitable and convenient access to charging infrastructure is essential. Equity in this paper refers to the proactive engagement with the community to ensure the benefits of streetlight charging are distributed equitably across diverse neighborhoods in Kansas City, providing fair charging opportunities and resources to all community members. This research explores the potential of utilizing streetlights—ubiquitous elements of urban electrical infrastructure—as low-cost, equitable EV charging solutions. Compared to conventional chargers, streetlight charging offers several notable advantages, including proximity to roadways, potential boosts to the local economy, and easier usage due to city ownership. These chargers also leverage existing power setups to minimize costs and maximize efficiency by reutilizing existing structures. In this manuscript, we introduce a systematic framework to develop, analyze, and evaluate a scalable and cost-effective streetlight charging solution. Initially, we employ a two-tiered site selection framework that accounts for both charging demand and equity considerations to identify optimal locations for streetlight chargers. We then assess the feasibility of these chargers through observational data from 23 units installed in Kansas City, Missouri, comparing their performance with traditional chargers. Our evaluation extends to the environmental impact, comparing reduced gasoline consumption and greenhouse gas (GHG) emission reductions between streetlights and regular charging stations. Our findings reveal that streetlight charging stations offer faster charging speeds than conventional stations, validating their viability for EV charging. Additionally, the duration of stay at streetlight chargers tends to be shorter, likely due to parking constraints or associated costs. Furthermore, streetlight-powered chargers demonstrate considerable environmental advantages, achieving 11.94% greater avoided gasoline consumption and 11.24% higher GHG reductions compared to regular charging stations, highlighting their substantial environmental benefits.
key_numbers:
  - { value: "23", label: "streetlight chargers installed in Kansas City and monitored for a full year" }
  - { value: "+11.9%", label: "more gasoline avoided per charging session than at regular stations" }
  - { value: "$13k–45k", label: "installation cost per site, depending on electrical upgrades" }
press:
  - { name: "Penn State News", url: "https://www.psu.edu/news/engineering/story/lighting-way-electric-vehicles-using-streetlamps-chargers", image: "/media/pan-streetlight-charging-jupd-2025/news-pennstate.jpg", date: "2025-10-01", alt: "Penn State News story: Lighting the way for electric vehicles by using streetlamps as chargers" }
  - { name: "Yahoo", url: "https://www.yahoo.com/news/articles/streetlights-could-answer-low-cost-210700670.html", image: "/media/pan-streetlight-charging-jupd-2025/news-yahoo.jpg", alt: "Yahoo News story with a photo of an electric car charging at a streetlight" }
  - { name: "MSN", url: "https://www.msn.com/en-us/money/technologyinvesting/penn-state-turns-streetlights-into-ev-chargers-to-boost-urban-access/ar-AA1NYYdP" }
  - { name: "Tech Briefs", url: "https://www.techbriefs.com/component/content/article/54104-using-street-lamps-as-ev-chargers", image: "/media/pan-streetlight-charging-jupd-2025/news-techbriefs.jpg", date: "2025-10-29", alt: "Tech Briefs story: Using Street Lamps as EV Chargers" }
  - { name: "Asianet News", url: "https://newsable.asianetnews.com/international/science/penn-state-turns-streetlights-into-smart-low-cost-ev-chargers-electric-vehicles-articleshow-hci6m43" }
  - { name: "Newsbreak", url: "https://www.newsbreak.com/earth-com-2402525/4274515734333-streetlights-could-power-the-future-of-electric-vehicle-charging", image: "/media/pan-streetlight-charging-jupd-2025/news-newsbreak.jpg", date: "2025-10-05", alt: "Newsbreak story: Streetlights could power the future of electric vehicle charging" }
  - { name: "新浪", url: "https://finance.sina.com.cn/tech/digi/2025-10-04/doc-infssrzs4429800.shtml", image: "/media/pan-streetlight-charging-jupd-2025/news-sina.jpg", date: "2025-10-04", alt: "新浪科技报道：美国团队将路灯改造成电动汽车充电桩，成本远低于商业用桩且更环保" }
  - { name: "凤凰网", url: "https://tech.ifeng.com/c/8nAaE6eUkJs", image: "/media/pan-streetlight-charging-jupd-2025/news-ifeng.jpg", date: "2025-10-04", alt: "凤凰网科技报道：美国团队将路灯改造成电动车充电桩：成本远低于商业用桩且更环保" }
updated: 2026-10-25
---

## What problem does this research solve?

<blockquote class="pull-quote">
  <p>Most EV owners charge at home, in a garage or driveway. <strong>Renters and people living in apartment buildings usually have neither, and they are also the households for whom a used EV, with its low fuel and maintenance costs, could make the most financial sense.</strong> Research shows that low-income communities, communities of color and residents of multi-unit buildings have the least access to charging. <strong>Large public programs such as the $5 billion National Electric Vehicle Infrastructure (NEVI) program and home-charger rebates do little for someone who parks on the street.</strong></p>
</blockquote>

Cities already own a dense network of powered poles along their curbs: streetlights. A charger mounted on a streetlight sits next to existing on-street parking, belongs to the city, and draws on power that is already there. That avoids most of the trenching, conduit, curb cutting and sidewalk work that makes conventional chargers expensive. Drivers can shop, eat or run errands nearby while they charge.

<figure>
  <img src="/media/pan-streetlight-charging-jupd-2025/streetlight-charger-pole.jpg" alt="A streetlight pole beside a park with a Level 2 EV charger and an EV-only parking sign mounted on it" loading="lazy" />
  <figcaption>A Level 2 charger mounted directly on a streetlight pole. The light keeps working; only some poles needed a wiring upgrade to the transformer. Photo: provided by XB Hu/Penn State.</figcaption>
</figure>

The idea is simple, but a city that wants to try it faces practical questions: **which streetlights should get chargers, will they work as well as regular stations, and what do they actually deliver?** This paper answers all three with a real deployment.

## What did we do?

With funding from the U.S. Department of Energy, the team worked with the Metropolitan Energy Center, the City of Kansas City, the utility Evergy, the Missouri Public Service Commission, the National Renewable Energy Laboratory and others to install streetlight chargers in the city's right-of-way. The project used single-port Level 2 chargers. Twenty-three streetlights were converted in December 2022, and we then tracked every charging session from January to December 2023, comparing them with sessions at Kansas City's regular public chargers.

<figure>
  <img src="/media/pan-streetlight-charging-jupd-2025/research-framework.png" alt="Flow diagram: a two-tiered site selection framework on the left, a data collection box in the middle, and feasibility testing and benefit analysis boxes on the right" loading="lazy" />
  <figcaption>The full framework. Left: choosing sites by predicted demand and by equity. Middle: the data behind it, from six years of charging logs to land use, weather, traffic and EV registrations. Right: testing whether the installed chargers perform as well as regular ones, and measuring their environmental benefit. From the paper.</figcaption>
</figure>

Choosing the sites came first, and it had to balance two goals that can pull in different directions: put chargers where they will be used, and put them where people have been left out.

- **Where will chargers be used?** We trained a boosting-based ensemble learning model on six years of logs from 455 Kansas City charging stations (67,576 weekly records), with 15 features covering nearby station density, land use, weather, charger type, traffic volume and trip production. It explained 63% of the variation in weekly use on held-out data and beat linear regression, nearest-neighbour and neural-network models on the same data. We used it to score 1,252 candidate locations and kept the 300 streetlights with the highest predicted use.
- **Who has been left out?** An equity model mapped three kinds of neighbourhoods: areas with many EVs but little home charging ("easy wins"), areas where demographics favour EV adoption but EVs and home charging are scarce ("unlock potential"), and low-income areas with many multi-family homes ("create opportunity"). These maps, built from EV registrations, housing and rental data, and EPA EJScreen indicators, were overlaid on the demand predictions.

<figure>
  <img src="/media/pan-streetlight-charging-jupd-2025/site-selection-funnel.png" alt="Diagram: 1,252 candidate locations narrowed to 300 by the demand model, to 40 by the equity model and site visits, and to 23 by community engagement" loading="lazy" />
  <figcaption>From 1,252 candidates to 23 chargers: the demand model, then equity screening and site visits, then community engagement each narrowed the list.</figcaption>
</figure>

The shortlist then met the street. Virtual GIS checks and in-person visits removed decorative or historic poles and spots next to fire hydrants, driveways, intersections or bike lanes, and favoured sites near transformers that needed no pavement work. That left about 40 locations. Community meetings added local knowledge, such as cell reception, charger orientation, traffic safety and nearby amenities, and settled the final 23.

<figure>
  <img src="/media/pan-streetlight-charging-jupd-2025/charger-sites-map.jpg" alt="Street map of the Kansas City metro area with 23 blue pins marking the streetlight charger sites, spread from the airport area in the north to Grandview in the south" loading="lazy" />
  <figcaption>The 23 streetlight charger sites, spread across Kansas City, Missouri, from the airport area in the north to Grandview in the south. Map: Google Maps.</figcaption>
</figure>

## What are the key findings?

**Charging speed is comparable to regular stations.** The worry with streetlights is power: can a pole built for a lamp charge a car well? Over 2023, the median streetlight session charged at **6.53 kW**, compared with **6.00 kW** at regular Level 2 stations, and most streetlight sessions fell between 4 and 6 kW. Streetlight chargers did not charge more slowly than the regular chargers they were compared with.

**Drivers stay a shorter time.** The median streetlight session lasted **2.23 hours**, against **3.84 hours** at regular stations, and almost none ran past five hours, while some regular sessions lasted up to a day. On-street parking limits and parking costs are the likely reasons; for a city, shorter stays mean each curbside charger can serve more cars.

<figure class="figure-row">
  <img src="/media/pan-streetlight-charging-jupd-2025/charging-speed-violin.png" alt="Violin plot of charging speed in kilowatts for streetlight stations (green) and regular stations (orange); the streetlight median line sits slightly higher" loading="lazy" />
  <img src="/media/pan-streetlight-charging-jupd-2025/charging-duration-violin.png" alt="Violin plot of total session duration in hours for streetlight stations (green) and regular stations (orange); streetlight sessions cluster under five hours" loading="lazy" />
  <figcaption>Left: charging speed per session; the streetlight median (green) is slightly higher. Right: time plugged in per session; streetlight sessions are shorter and more tightly grouped. From the paper.</figcaption>
</figure>

**They deliver more environmental benefit per session.** Comparing each session with the gasoline a conventional car would have burned over the same distance, a streetlight session avoided **2.25 gallons** on average versus **2.01 gallons** at a regular station, **11.94% more**. Greenhouse gas reductions followed: **12.77 kg** per session versus **11.48 kg**, or **11.24% more**.

<figure class="figure-row">
  <img src="/media/pan-streetlight-charging-jupd-2025/avoided-gasoline.png" alt="Horizontal histogram of avoided gasoline per session in gallons; the orange streetlight distribution extends further into the 5 to 10 gallon range than the green regular distribution" loading="lazy" />
  <img src="/media/pan-streetlight-charging-jupd-2025/ghg-reduction.png" alt="Horizontal histogram of greenhouse gas reduction per session in kilograms; the orange streetlight distribution has more sessions in the 20 to 40 kg range" loading="lazy" />
  <figcaption>Gasoline avoided (left) and greenhouse gas emissions avoided (right) per session. Orange is streetlight stations, green is regular stations; note the extra orange mass in the 5–10 gallon and 20–40 kg ranges. From the paper.</figcaption>
</figure>

Installation cost **$13,000 to $45,000 per site**, depending mainly on how much electrical upgrade a pole needed.

## What can this be used for?

- **Cities and utilities** considering curbside charging: the paper gives a tested, step-by-step siting process, from demand prediction to equity mapping to site visits and community meetings, along with the practical screening rules (pole type, parking restrictions, distance to transformers) and real cost ranges.
- **Agencies administering EV infrastructure funds**: the equity model shows one way to make sure publicly funded chargers reach renters, multi-family housing and low-income neighbourhoods without ignoring where chargers will be used.
- **Researchers and planners**: a year of real-world data comparing streetlight and conventional chargers, and a framework that can be rerun in another city with its own charging logs and demographic layers. Next steps include adding finer socio-economic and weather data to the demand model.
