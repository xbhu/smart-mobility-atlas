---
tldr: >-
  We built VisionEV, a multimodal AI model that reads a satellite image of a candidate site alongside
  basic traffic data and predicts weekly EV charging demand, beating conventional models on 189 Kansas
  City stations without anyone visiting the sites or hand-coding the surroundings.
hero:
  image: /media/song-visionev-trd-2026/satellite-four-sites.jpg
  alt: Four satellite views of EV charging station locations in Kansas City, each marked with a red pin - a downtown office block, a residential street beside a park, an industrial site by a railyard, and a parking lot near the zoo
  caption: What VisionEV sees. Clockwise from top left, satellite views of four Kansas City charging stations (red pins) in a downtown commercial block, a residential street, a parking lot near the zoo, and an industrial site by a railyard. The model learns from the pictures what kind of place each station is in.
  credit: "Imagery: Google, Airbus, Maxar Technologies (from the paper)"
affiliations:
  - The Pennsylvania State University
author_affiliations: [[1], [1]]
abstract: |-
  This manuscript presents VisionEV, a multimodal large language model (LLM) framework designed to predict electric vehicle (EV) charging demand by leveraging satellite imagery and structured textual data. Spatial context—including parking availability, land use, and nearby amenities—is critical for accurate demand estimation. However, site selection in EV infrastructure planning remains both labor-intensive and inconsistent, requiring human experts to conduct in-person audits and manually define spatial features. To overcome these limitations, VisionEV introduces an automated spatial reasoning pipeline that integrates satellite imagery of candidate locations as visual inputs, allowing the model to learn nuanced spatial patterns directly from imagery, without relying on predefined descriptors. Complementary station-level attributes, including traffic flow and temporal indicators, are embedded into domain-informed textual prompts to simulate planner reasoning. A core technical challenge lies in enabling coherent reasoning across semantically distinct inputs—structured textual data and perceptual visual context. VisionEV addresses this by reformulating the task as multimodal text generation, aligning both modalities within a shared embedding space through vision-informed prompting and lightweight domain-adaptive fine-tuning. We evaluate VisionEV using a real-world dataset of 22,852 training samples and 2,858 test samples collected from 189 public EV charging stations in Kansas City, Missouri. In the full-shot setting, VisionEV achieves superior accuracy (RMSE: 2.87, MAE: 1.98), outperforming the strongest baseline, LightGBM, by 1.0% and 5.3%, respectively. Few-shot, within-city zero-shot and cross-region spatial hold-out experiments demonstrate VisionEV's ability to generalize across unseen scenarios, and ablation studies confirm the contributions of visual input, prompt design, and fine-tuning. These results underscore the promise of multimodal LLMs in supporting scalable, data-driven EV infrastructure planning through automated spatial understanding.
key_numbers:
  - { value: "189", label: "public charging stations in Kansas City, Missouri, 2021–2023" }
  - { value: "5.3%", label: "lower average error than the best conventional model, LightGBM" }
  - { value: "20%", label: "of stations for training was enough to lead every model on the other 80%" }
  - { value: "≈24 min", label: "to score 10,000 candidate sites on a single GPU" }
updated: 2026-10-25
---

## What problem does this research solve?

Before a city or utility builds a public EV charger, someone has to predict how much it will be used. Get it wrong and money goes into chargers that sit idle while busy neighbourhoods go without. Traffic counts and trip statistics help, but much of what makes a site busy is local: is there parking, is it next to offices, shops or homes, is it easy to see and reach?

Today that local knowledge comes from people. Planners pick features by hand, rank candidate sites with a model, and then **visit the most promising ones in person** to record parking, land use, visibility and hazards such as hydrants and intersections. That is slow and costly, so it limits how many sites get a serious look. In our earlier [streetlight charging project in Kansas City](/pan-streetlight-charging-jupd-2025/), planners identified about 300 potential locations but had to cut the list to 60 for detailed in-person evaluation. What gets recorded also depends on who does the visit and which features they decide matter.

<figure>
  <img src="/media/song-visionev-trd-2026/approaches-compared.png" alt="Diagram comparing three approaches. Approach 1, traditional models: define features, train, rank candidates, visit sites, update features, predict. Approach 2, text-only LLMs: same site visits. Approach 3, VisionEV: satellite imagery and a text prompt go straight into a multimodal model that predicts demand." loading="lazy" />
  <figcaption>Three ways to predict charging demand at candidate sites. Traditional models (top) and newer text-only language models (middle) both still rely on costly site visits to capture the surroundings. VisionEV (bottom) reads the surroundings from satellite imagery instead, so every candidate can be scored the same way. From the paper.</figcaption>
</figure>

Large language models (LLMs) have recently been used for this kind of forecast: an earlier method, ChatEV, writes a station's data as a sentence and lets a language model predict demand. But a language model only reads text. The spatial context that matters most still has to be collected by someone and typed in.

## What did we do?

We built **VisionEV**, a model that looks at a satellite image of each site and reads a short text description of it at the same time. The image comes from a public source (the Google Maps API, centred on the station). The text carries the few numbers planners already have: trip production from the regional travel demand model, annual average daily traffic (AADT) on the nearby road, the season and the week of the year. The model answers with one number: how many charging sessions to expect at that station that week.

The text is written the way one would brief an expert. Here is the exact prompt format used in the paper:

<figure>
<pre class="prompt-box">You are an expert in electric vehicle charging infrastructure,
who is good at &lt;charging demand forecasting&gt;.
We are currently assessing a location in Kansas City, Missouri.
Please review the following station data:
• Examine the attached satellite imagery to understand the spatial context  <span class="prompt-image">+ image</span>
• The station is situated in a traffic assignment zone with trip production value of 340.22
• Current nearby traffic flow (AADT) measures 4079.97 vehicles
• Time period: Fall season, week 44 of the year
Now, pay attention! Your task is to &lt;predict the number of charging sessions for this station during the specified week&gt;
In your answer, you should provide the value of your prediction only.</pre>
  <figcaption>The prompt VisionEV receives for one station and one week, together with that station's satellite image. It sets an expert role, states the planning data in plain sentences, and asks for a single number. From the paper.</figcaption>
</figure>

We tested it on real data from Kansas City, Missouri: **190,116 charging events** at **189 public charging stations** from 2021 to 2023, spread from downtown to the suburbs. Grouped by station and week, that gives 28,566 samples, split at random into 80% for training, 10% for tuning and 10% for testing.

<figure>
  <img src="/media/song-visionev-trd-2026/kansas-city-stations.jpg" alt="Two street maps of Kansas City with green charging-station icons. Left: the whole metro area, with stations spread from the northern suburbs to Grandview and a dense cluster downtown. Right: a closer view of downtown with dozens of stations." loading="lazy" />
  <figcaption>The 189 public charging stations in the study (green). Left: the Kansas City metro area. Right: downtown, where stations are most densely packed. Map: © OpenStreetMap contributors; from the paper.</figcaption>
</figure>

## What is the key methodological contribution?

VisionEV turns demand forecasting into a **question answered from a picture and a paragraph**. It is built on PaliGemma, an openly available vision-language model with about 3 billion parameters.

<figure class="figure-narrow">
  <img src="/media/song-visionev-trd-2026/model-framework.png" alt="Flow diagram: an input prompt and a satellite image enter the language model; a SigLIP vision encoder produces visual embeddings, the text produces textual embeddings, the two are concatenated, and the model generates a demand token that is decoded into a charging demand prediction." loading="lazy" />
  <figcaption>Inside VisionEV. The image becomes a set of visual tokens, the prompt becomes text tokens, and one model reasons over both together before writing out the predicted number of sessions. From the paper.</figcaption>
</figure>

Three design choices make this work:

- **The picture replaces the site visit.** A vision encoder (SigLIP) turns the satellite image into tokens the language model can read, so land use, building density, parking and access are learned directly from the image. Nobody defines those features by hand.
- **Planning data is written as text.** Traffic, trip production and season go in as plain sentences, which lines them up with what a language model already understands and avoids heavy feature engineering.
- **Light, short fine-tuning.** The vision encoder stays frozen; only the connecting layer and the language model are adjusted to the EV task, with a short training run and a cosine learning-rate schedule. The whole thing was fine-tuned on a single 24 GB GPU in Google Colab. Because the answer is generated as a number token, it is always a whole, non-negative count of sessions.

For a fair test, the comparison models got the same traffic and time inputs plus a hand-coded land-use label for each station (institutional, transportation, commercial, residential, recreational, vacant or industrial): Linear Regression, LightGBM (a strong tree-based model), a graph neural network (GCN) linking nearby stations, and Gemma, a text-only language model given the same prompt with land use written in words instead of an image.

## What are the key findings?

**With all the data, VisionEV is the most accurate model.** It predicted weekly sessions with a typical error of under two sessions per station-week (MAE 1.98), 5.3% lower than LightGBM, the strongest competitor (2.09), and well below the text-only language model (2.50). The gain over LightGBM in root-mean-square error is small (1.0%), but VisionEV gets there without any hand-coded spatial features.

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">Model</th><th scope="col" class="num">RMSE</th><th scope="col" class="num">MAE</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Linear Regression<span>Statistical</span></th><td class="num">4.91</td><td class="num">3.60</td></tr>
        <tr><th scope="row">LightGBM<span>Gradient-boosted trees</span></th><td class="num">2.90</td><td class="num">2.09</td></tr>
        <tr><th scope="row">GCN<span>Graph neural network</span></th><td class="num">3.77</td><td class="num">2.79</td></tr>
        <tr><th scope="row">Gemma<span>Text-only language model</span></th><td class="num">3.18</td><td class="num">2.50</td></tr>
        <tr class="is-highlight"><th scope="row">VisionEV<span>Satellite image + text</span></th><td class="num">2.87</td><td class="num">1.98</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>Prediction error on the held-out test weeks, in charging sessions per station per week (lower is better). RMSE weighs large misses more heavily; MAE is the average miss. From Table 2 of the paper.</figcaption>
</figure>

**It learns quickly from little data.** Trained on only 5% to 20% of the data, VisionEV still led every model at every level, averaging an RMSE of 3.30 against 3.53 for LightGBM and 3.78 for the text-only model. Linear Regression and the graph model broke down (average RMSE near 10 to 11).

**It works at stations it has never seen.** This is the test that matters for planning new sites. We trained on a random 20%, 40%, 60% or 80% of the stations and predicted the rest, so the model never saw the test stations' images. VisionEV had the lowest error in every split. Trained on just 20% of stations, it reached an RMSE of 3.98 at the other 80%, ahead of LightGBM (4.19) and the text-only model (4.22), with the smallest spread of errors.

<figure class="figure-row">
  <img src="/media/song-visionev-trd-2026/zero-shot-20.png" alt="Bar chart of RMSE with error bars when trained on 20% of stations: Linear Regression 11.24, LightGBM 4.19, GCN 10.12, Gemma 4.22, VisionEV 3.98 (lowest)." loading="lazy" />
  <img src="/media/song-visionev-trd-2026/zero-shot-80.png" alt="Bar chart of RMSE with error bars when trained on 80% of stations: Linear Regression 5.11, LightGBM 3.23, GCN 4.01, Gemma 3.24, VisionEV 3.18 (lowest)." loading="lazy" />
  <figcaption>Error at stations the model never saw during training (mean ± standard deviation of RMSE, lower is better). Left: trained on 20% of stations, tested on the other 80%. Right: trained on 80%, tested on 20%. VisionEV (right-most bar) is lowest in both. From the paper.</figcaption>
</figure>

Its misses are also more balanced. Compared with LightGBM, VisionEV's errors are centred more tightly on zero and are more symmetric, while LightGBM's lean to one side. For a planner ranking sites, a model that is not systematically too high or too low can change which sites make the shortlist even when average errors are close.

<figure class="figure-row">
  <img src="/media/song-visionev-trd-2026/residuals-20.png" alt="Two overlapping bell-shaped curves of prediction residuals for LightGBM (solid blue) and VisionEV (dashed orange), trained on 20% of stations; the VisionEV curve is slightly taller and centred closer to zero." loading="lazy" />
  <img src="/media/song-visionev-trd-2026/residuals-80.png" alt="The same residual comparison when trained on 80% of stations; again the VisionEV curve is taller and centred closer to zero." loading="lazy" />
  <figcaption>How far off the predictions are at unseen stations: LightGBM (solid blue) against VisionEV (dashed orange). Left: trained on 20% of stations. Right: trained on 80%. From the paper.</figcaption>
</figure>

**It transfers between very different parts of the city.** Kansas City's 91 downtown stations and the suburban stations differ sharply in land use and traffic. Trained on downtown and tested on the suburbs, and the other way round, VisionEV again had the lowest error (RMSE 3.44 and 3.41, against 3.52 and 3.46 for LightGBM). Compared with training on the whole city, its RMSE grew by about 19%, on par with or below LightGBM (about 20%) and far less than Linear Regression and the graph model (roughly 38% to 52%).

**Every part of the design pulls its weight.** Removing one piece at a time and averaging over the full-data, little-data and unseen-station tests:

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">Version of the model</th><th scope="col" class="num">Mean RMSE</th><th scope="col" class="num">Mean MAE</th></tr>
      </thead>
      <tbody>
        <tr class="is-highlight"><th scope="row">Full VisionEV</th><td class="num">3.22</td><td class="num">2.29</td></tr>
        <tr><th scope="row">Without the expert-style prompt</th><td class="num">3.43</td><td class="num">2.43</td></tr>
        <tr><th scope="row">Without the satellite image</th><td class="num">3.95</td><td class="num">2.84</td></tr>
        <tr><th scope="row">Without fine-tuning<span>Off-the-shelf PaliGemma</span></th><td class="num">4.46</td><td class="num">3.34</td></tr>
        <tr><th scope="row">Without pre-training<span>Trained from scratch</span></th><td class="num">9.57</td><td class="num">7.02</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>What each component adds (lower is better). Taking away the satellite image raises the average RMSE from 3.22 to 3.95; the pre-trained model's general knowledge matters most of all. Averaged over the full-data, little-data and unseen-station tests; from Table 4 of the paper.</figcaption>
</figure>

**It is cheap to run.** Scoring the 2,856 validation samples took 413 seconds on one GPU, about 0.15 seconds per site-week, so 10,000 candidate sites would take roughly 24 minutes. Image features need to be computed only once per site; after that, a new week or season is just a new line of text. Prediction needs a GPU with 8 GB of memory, and fine-tuning about 24 GB.

## What can this be used for?

- **Screening many more candidate sites.** Planners at cities, DOTs, utilities and charging companies can score every candidate location from public imagery and a few planning numbers, then send staff only to the short list. The paper's own advice: if all you need is the lowest average error on one well-labelled dataset, a well-tuned LightGBM may be enough; VisionEV adds the most when sites are new, data are scarce, or hand-coding the surroundings would be expensive.
- **Places with little charging history.** Because it does well with small training sets and at unseen stations, the approach suits early deployments, smaller cities and neighbourhoods that have few chargers today, which matters for building out charging equitably.
- **Any city, not just Kansas City.** The inputs are satellite imagery, traffic or trip indicators and the calendar, all widely available. Next steps named in the paper are testing other image encoders and vision-language models, and training and testing across several cities.
