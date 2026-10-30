---
tldr: >-
  We trained a fast, GPU-based machine learning model on 2,699 records from 246 test pavements
  across the U.S. to predict how rough asphalt roads become, and used an explanation method to show
  what drives that roughness; it beat the design-guide equation, a neural network and a random
  forest, and still works with just six inputs that a survey of the wheel paths can supply.
hero:
  image: /media/song-pavement-condition-tits-2022/shap-beeswarm.png
  alt: >-
    SHAP beeswarm plot of the ten most important features. Each row is one feature, from initial
    roughness (IRI0) at the top through rut depth, wheel-path cracks, patching, friction, other cracks
    and age to truck loading (Esal) at the bottom. Each dot is one pavement record, colored from blue
    (low value) to red (high value). In the top rows the red dots stretch far to the right of zero,
    while in the bottom row (Esal) the red dots sit slightly left of zero
  caption: >-
    What the model learned, opened up. Each dot is one pavement record; dots to the right of the
    center line are records the model judged rougher because of that feature. Red means a high value.
    Rough-when-new pavements (IRI₀, top row) and deep ruts (Rt) push roughness up the most; the cracks
    and patches that follow are mostly in the wheel paths.
  credit: From the paper
affiliations:
  - The Pennsylvania State University
  - Missouri University of Science and Technology
author_affiliations: [[1], [2], [1], [2]]
abstract: |-
  Accurate prediction of asphalt pavement condition is important to guide pavement maintenance practices. The existing models for pavement condition predictions are predominantly based on linear regressions or simple machine learning techniques. However, additional work on these models is needed to improve their basic assumptions, training efficiency, and interpretability. To this end, a new modeling approach is proposed in this manuscript, which includes a ThunderGBM-based ensemble learning model, coupled with the Shapley Additive Explanation (SHAP) method, to predict the International Roughness Index (IRI) of asphalt pavements. The SHAP method was applied to interpret the underlying influencing factors and their interactions. Twenty features were initially identified as the model inputs, and 2,699 observations were extracted from the Long-Term Pavement Performance (LTPP) database. Three benchmark models, namely the Mechanistic-Empirical Pavement Design Guide (MEPDG) model, the ANN model and the RF model, were used for comparison. The results showed that the developed model achieved a satisfactory result with a R-squared (R²) value of 0.88 and Root Mean Square Error (RMSE) of 0.08, both better than three benchmark models. It ran 86 times and 2.3 times faster than the ANN and RF model, respectively. Feature interpretation was performed to identify the top influencing factors of IRI. The 20-feature model was further simplified based on the analysis result. The simplified model only required six features to efficiently and effectively predict IRI using the proposed ThunderGBM-based approach, which can reduce the workload in data collection and management for pavement engineers.
key_numbers:
  - { value: "0.88", label: "R² on test pavements the model never saw, vs. 0.56 for the design-guide (MEPDG) equation" }
  - { value: "5.1 s", label: "to train the model, vs. 451 s for a neural network and 17 s for a random forest" }
  - { value: "2,699", label: "roughness records from 246 LTPP test sections in all four U.S. climate zones" }
  - { value: "6", label: "inputs are enough for the simplified model, which still reaches R² = 0.83" }
updated: 2026-10-27
---

## What problem does this research solve?

Drivers feel pavement condition as **roughness**: the bumps and dips that rattle a car and its passengers. Engineers measure it with the **International Roughness Index (IRI)**, developed by the World Bank in the 1980s, in meters of up-and-down suspension movement per kilometer driven. A higher IRI means a rougher road. Rough roads raise fuel use, vehicle repair costs, crashes and greenhouse gas emissions, and surveying every road often enough to keep track is expensive. So highway agencies rely on models that **predict** how roughness will grow, and use them to decide where and when to repair.

The standard tool, the equation in the Mechanistic-Empirical Pavement Design Guide (MEPDG), is a straight-line formula built from 1,926 records in the national Long-Term Pavement Performance (LTPP) database. It explains only **56%** of the variation in roughness (R² = 0.56). Straight lines cannot capture how distress, traffic and climate interact, and the factors overlap so much that the formula cannot say which one really matters.

<blockquote class="pull-quote">
  <p>Machine learning models such as neural networks and random forests predict better, but they bring two new problems. They get slow to train as they grow, and <strong>they work like black boxes: they give a number without saying why.</strong> <strong>A pavement engineer who has to defend a maintenance budget needs both a good prediction and a reason for it.</strong></p>
</blockquote>

## What did we do?

We built our data set from the LTPP program, which has tracked the condition of real test pavements across the U.S. for decades. We took **2,699 roughness measurements from 246 road sections** in the SPS-1 experiment, which studies new asphalt pavements built with different structures. The sections cover all four U.S. climate zones: dry or wet, with or without freezing.

<figure>
  <img src="/media/song-pavement-condition-tits-2022/sps1-sections-map.jpg" alt="Map of the contiguous United States with blue circles marking clusters of test sections, labeled with counts from 12 to 20, in states from Nevada and Arizona to Florida, Michigan and New Jersey" loading="lazy" />
  <figcaption>Where the data come from: the LTPP SPS-1 test sections used in the study, grouped by location (each number is a count of sections). They span every climate zone, so the model sees the full range of U.S. conditions. Map from the paper; basemap: Google Maps.</figcaption>
</figure>

For each measurement the model gets **20 inputs** that may affect roughness, grouped into six kinds:

- **Pavement condition**: roughness right after construction (initial IRI, or IRI₀), rut depth, surface friction, patching, and several kinds of cracking, measured inside and outside the wheel paths
- **Structure**: thickness and stiffness of the asphalt layers
- **Drainage**: how fast water flows through the pavement material
- **Climate**: monthly precipitation and a freezing index
- **Traffic**: annual truck loading (equivalent single axle loads, ESALs) and pavement age
- **Materials**: properties of the asphalt binder and the share of coarse aggregate

<figure class="figure-row">
  <img src="/media/song-pavement-condition-tits-2022/iri-distribution.png" alt="Histogram of IRI values from about 0.2 to 1.8 m/km, peaking just under 1 m/km, with mean, median and quartile lines" loading="lazy" />
  <img src="/media/song-pavement-condition-tits-2022/initial-iri-distribution.png" alt="Histogram of initial IRI values from about 0.2 to 1.8 m/km, peaking around 0.8 m/km" loading="lazy" />
  <figcaption>Left: the roughness the model has to predict, with a mean of 0.94 m/km; most sections are in good condition. Right: the same sections when new, with a mean initial roughness of 0.81 m/km. Images: from the paper.</figcaption>
</figure>

We trained the model on a random 80% of the records, tuned it with a grid search and cross-validation, and kept the other 20% aside as **test pavements** to check its predictions on data it had never seen.

## What is the key methodological contribution?

The paper pairs a fast prediction model with a method that explains it.

**Prediction: ThunderGBM.** Gradient boosting builds thousands of small decision trees one after another, with each new tree correcting the errors left by the ones before it. ThunderGBM is an implementation designed for graphics processors (GPUs): it computes the error corrections for many records in parallel and splits the work of building each tree across the GPU. The final model uses 3,600 trees, each up to 6 levels deep, and training error levels off after about 1,000 trees.

**Explanation: SHAP.** The Shapley Additive Explanation method comes from game theory. It treats the inputs as players sharing a prize, the prediction, and gives each one its fair share by averaging its contribution over every possible order in which the inputs could be added. Unlike simpler importance scores, SHAP is consistent: if an input truly matters more, it never receives less credit. For every one of the 2,699 records it tells us how much each input pushed the predicted roughness up or down, which is what the plot at the top of this page shows.

<figure class="figure-row">
  <img src="/media/song-pavement-condition-tits-2022/fit-training.png" alt="Scatter plot of predicted against measured IRI for the training set; points lie almost exactly on the diagonal, R squared 0.999" loading="lazy" />
  <img src="/media/song-pavement-condition-tits-2022/fit-testing.png" alt="Scatter plot of predicted against measured IRI for the test set; points cluster tightly around the diagonal, R squared 0.881" loading="lazy" />
  <figcaption>Predicted vs. measured roughness. Left: the training pavements (R² = 0.999). Right: the test pavements the model never saw (R² = 0.881). Points close to the dashed diagonal are accurate predictions. Images: from the paper.</figcaption>
</figure>

## What are the key findings?

**More accurate and faster than the alternatives.** On the test pavements, the model explained **88%** of the variation in roughness (R² = 0.881, RMSE = 0.081 m/km). The MEPDG equation reached 0.560, a neural network 0.792 and a random forest 0.862, all evaluated on the same test pavements. The model also trained in **5.1 seconds**, against 451 seconds for the neural network and 17 seconds for the random forest. Because each boosted tree only corrects the remaining error, training error drops with every tree, so the model settles quickly.

<figure>
  <img src="/media/song-pavement-condition-tits-2022/model-benchmark.png" alt="Two bar charts. Left, R squared on the test set: MEPDG 0.560, artificial neural network 0.792, random forest 0.862, ThunderGBM 0.881. Right, training time on a log scale: MEPDG 0.01 s, neural network 451.03 s, random forest 17.12 s, ThunderGBM 5.14 s" loading="lazy" />
  <figcaption>The proposed model (dark bars) is the most accurate of the four and trains far faster than the other machine learning models. The MEPDG is a fixed equation, so it needs almost no training time, but it is much less accurate. Chart drawn from the numbers in the paper.</figcaption>
</figure>

**Roughness is mostly about the pavement's own condition.** SHAP ranks the inputs by how much of each prediction they explain. The top ten account for 88.5% of the total:

- **How rough the road was when new** matters most, at 25%, more than twice any other input. A road built smooth stays smoother.
- **Rut depth** (12%) and **lengthwise cracks in the wheel paths** (8.5%) come next. These top three are also the main inputs of the MEPDG equation, which is a useful check that the model learned something sensible.
- Distresses **in the wheel paths**, where tires actually roll (ruts, wheel-path cracks, friction), have the strongest effects. For every distress, more of it means a rougher road.

<figure>
  <img src="/media/song-pavement-condition-tits-2022/feature-importance.png" alt="Bar chart of the share of the model's explanation for the ten most important features: roughness when new 25.17, rut depth 11.94, lengthwise cracks in the wheel paths 8.48, patched area 7.99, surface friction 7.97, lengthwise cracks outside the wheel paths 6.88, wheel-path cracks 5.28, alligator cracking 5.18, pavement age 4.95, truck loading 4.20. Six of the bars are dark: those kept in the simplified model" loading="lazy" />
  <figcaption>The ten inputs that explain the most, as a share of the model's total explanation across all 20 inputs. Dark bars are the six kept in the simplified model. Chart drawn from the numbers in the paper.</figcaption>
</figure>

**A surprise about trucks.** Sections with heavier truck traffic were predicted to be slightly *smoother*. The data explain why: roads designed for heavy traffic are built thicker. The sections with high truck loading had asphalt surface and binder layers averaging **5.63 inches**, against **4.96 inches** for those with low loading. Other studies have also found that the 1993 AASHTO design method tends to make pavements thicker than their design traffic requires.

**Six inputs are enough.** Using the SHAP ranking, we retrained the model with only six inputs: pavement age, initial roughness, rut depth, wheel-path longitudinal cracks, friction and wheel-path cracks. The last four can all be measured by surveying the wheel paths. Accuracy on the test pavements fell only from 0.88 to **0.83**, so an agency can get a useful prediction from far less data.

## What can this be used for?

- **Maintenance planning.** Because wheel-path distresses drive roughness, maintenance effort should go to the wheel paths first. Sealing early cracks along the wheel paths, rather than patching later, is a cost-effective way to keep a road smooth through its service life; microsurfacing is an option when ruts and cracks appear together.
- **Construction quality.** Initial roughness is the single strongest predictor, so getting a pavement smooth on the day it opens pays off for years.
- **Leaner data collection.** The six-input model lets an agency predict roughness from a survey focused on the wheel paths, cutting the workload of data collection and management.
- **Explainable decisions.** SHAP turns a machine learning prediction into reasons an engineer can check and explain, which makes the model easier to trust and to use in a pavement management system.

All data used in the study are public and can be downloaded from the [LTPP InfoPave Standard Data Release](https://infopave.fhwa.dot.gov/Data/StandardDataRelease/).

This research was partially supported by a seed grant, "Preparing Multidisciplinary Datahub for Digital and Intelligent Infrastructure System – Preliminary Phase," from the Center for Intelligent Infrastructure (CII) at Missouri University of Science and Technology.
