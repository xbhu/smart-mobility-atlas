---
title: VisionEV：基于卫星影像、具备空间感知能力的多模态大语言模型电动汽车充电需求预测
tldr: >-
  我们开发了多模态AI模型VisionEV：它一边“看”候选站点的卫星影像，一边读取基本的交通数据，
  直接预测每周的电动汽车充电需求。在堪萨斯城189个充电站上，它不需要实地踏勘、也不需要人工编码周边环境，
  预测精度就超过了传统模型。
hero:
  caption: VisionEV“看到”的画面。从左上角起顺时针，依次是堪萨斯城四个充电站（红色标记）所在的市中心商业街区、居住区街道、动物园附近的停车场，以及铁路货场旁的工业用地。模型从图像中自己学会判断每个站点处在什么样的环境里。
key_numbers:
  - { value: "189", label: "个密苏里州堪萨斯城公共充电站，2021–2023年数据" }
  - { value: "5.3%", label: "平均误差低于最强的传统模型LightGBM" }
  - { value: "20%", label: "的站点用于训练，就能在其余80%的站点上领先所有模型" }
  - { value: "约24分钟", label: "单块GPU即可完成1万个候选站点的评分" }
updated: 2026-10-25
---

## 这项研究解决了什么问题？

城市或电力公司在建设公共充电桩之前，必须先预测它会被用得多频繁。预测错了，钱就会花在闲置的充电桩上，而真正繁忙的社区却没有桩可用。交通量和出行统计数据有帮助，但决定一个站点是否繁忙的很多因素都是“本地”的：有没有停车位？旁边是写字楼、商店还是住宅？是否容易看到、方便进出？

目前这些本地信息靠人来收集。规划人员先手工挑选特征，用模型给候选站点排序，再**亲自到排名靠前的站点实地踏勘**，记录停车条件、土地利用、可见性，以及消防栓、交叉口等安全约束。这种做法费时费钱，能认真评估的站点数量也因此受限。在我们此前的[堪萨斯城路灯充电项目](/pan-streetlight-charging-jupd-2025/zh/)中，规划人员找出了约300个潜在站点，最后只能挑出60个做详细的实地评估。而记录下来的内容，也取决于谁去踏勘、他认为哪些特征重要。

<figure>
  <img src="/media/song-visionev-trd-2026/approaches-compared.png" alt="三种方法的对比图。方法一：传统模型，定义特征、训练、候选站点排序、实地踏勘、更新空间特征、预测；方法二：纯文本大语言模型，同样需要实地踏勘；方法三：VisionEV，卫星影像和文本提示直接输入多模态模型得到需求预测。" loading="lazy" />
  <figcaption>预测候选站点充电需求的三种方式。传统模型（上）和较新的纯文本大语言模型（中）仍然要靠昂贵的实地踏勘来获取周边环境信息；VisionEV（下）则直接从卫星影像中读取周边环境，每个候选站点都能用同一标准评分。图片来源：论文。</figcaption>
</figure>

近来已经有人用大语言模型（LLM）做这类预测：早先的ChatEV方法把站点数据写成一句话，再让语言模型预测需求。但语言模型只能读文字，最关键的空间信息仍然需要有人去收集、再手工输入。

## 我们做了什么？

我们开发了**VisionEV**：它在“看”每个站点卫星影像的同时，读取一段关于该站点的简短文字描述。影像来自公开来源（以充电站为中心，通过Google Maps API获取）。文字则包含规划人员手头本来就有的几项数据：区域出行需求模型给出的出行产生量、附近道路的年平均日交通量（AADT）、季节以及一年中的第几周。模型只输出一个数字：该站点这一周预计会有多少次充电。

文字部分的写法，就像在给一位专家做简报。下面是论文中使用的提示词原文：

<figure>
<pre class="prompt-box">You are an expert in electric vehicle charging infrastructure,
who is good at &lt;charging demand forecasting&gt;.
We are currently assessing a location in Kansas City, Missouri.
Please review the following station data:
• Examine the attached satellite imagery to understand the spatial context  <span class="prompt-image">+ 影像</span>
• The station is situated in a traffic assignment zone with trip production value of 340.22
• Current nearby traffic flow (AADT) measures 4079.97 vehicles
• Time period: Fall season, week 44 of the year
Now, pay attention! Your task is to &lt;predict the number of charging sessions for this station during the specified week&gt;
In your answer, you should provide the value of your prediction only.</pre>
  <figcaption>VisionEV针对某一站点、某一周收到的提示词，与该站点的卫星影像一同输入。提示词先设定“专家”角色，再用平实的句子写出规划数据（出行产生量、交通量、季节和周次），最后要求只给出一个数字。图片来源：论文。</figcaption>
</figure>

我们用密苏里州堪萨斯城的真实数据做了检验：2021至2023年间，**189个公共充电站**共**190,116次充电记录**，站点从市中心一直分布到郊区。按“站点×周”汇总后得到28,566个样本，随机划分为80%训练、10%调参、10%测试。

<figure>
  <img src="/media/song-visionev-trd-2026/kansas-city-stations.jpg" alt="两幅堪萨斯城街道地图，绿色图标为充电站。左图为整个都市区，站点从北部郊区分布到格兰德维尤，市中心高度密集；右图为市中心近景，有几十个站点。" loading="lazy" />
  <figcaption>研究中的189个公共充电站（绿色）。左：堪萨斯城都市区；右：站点最密集的市中心。地图：© OpenStreetMap贡献者；图片来源：论文。</figcaption>
</figure>

## 关键的方法创新是什么？

VisionEV把需求预测变成了**看一张图、读一段话，然后回答一个问题**。它以PaliGemma为基础，这是一个公开可用、约30亿参数的视觉-语言模型。

<figure class="figure-narrow">
  <img src="/media/song-visionev-trd-2026/model-framework.png" alt="流程图：输入提示词和卫星影像进入大语言模型；SigLIP视觉编码器生成视觉嵌入，文本生成文本嵌入，二者拼接后，模型生成需求词元，再解码为充电需求预测值。" loading="lazy" />
  <figcaption>VisionEV内部结构。影像被转换成一组视觉词元，提示词被转换成文本词元，同一个模型对两者进行联合推理，最后写出预测的充电次数。图片来源：论文。</figcaption>
</figure>

三个设计让这一思路得以实现：

- **用影像代替实地踏勘。** 视觉编码器（SigLIP）把卫星影像转换成语言模型能“读懂”的词元，土地利用、建筑密度、停车条件和可达性都直接从影像中学习，不需要任何人手工定义这些特征。
- **把规划数据写成文字。** 交通量、出行产生量和季节以平实的句子输入，与语言模型已有的知识对齐，省去了繁重的特征工程。
- **轻量、短程的微调。** 视觉编码器保持冻结，只针对充电预测任务调整连接层和语言模型，采用短程训练和余弦学习率调度。整个模型在Google Colab上用一块24 GB显存的GPU即可完成微调。由于答案以数字词元的形式生成，输出始终是非负整数的充电次数。

为了公平比较，对比模型使用相同的交通量和时间输入，并额外给每个站点加上人工编码的土地利用标签（机构、交通、商业、居住、休闲、空地或工业）。对比模型包括：线性回归、LightGBM（一种很强的树模型）、连接邻近站点的图卷积网络（GCN），以及Gemma——一个纯文本语言模型，输入相同的提示词，但土地利用用文字描述而不是影像。

## 主要发现是什么？

**在数据充足时，VisionEV精度最高。** 它对每站每周充电次数的平均误差不到2次（MAE 1.98），比最强的对手LightGBM（2.09）低5.3%，也明显低于纯文本语言模型（2.50）。在均方根误差上，它对LightGBM的优势较小（1.0%），但VisionEV完全不需要人工编码的空间特征。

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">模型</th><th scope="col" class="num">RMSE</th><th scope="col" class="num">MAE</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">线性回归<span>统计模型</span></th><td class="num">4.91</td><td class="num">3.60</td></tr>
        <tr><th scope="row">LightGBM<span>梯度提升树</span></th><td class="num">2.90</td><td class="num">2.09</td></tr>
        <tr><th scope="row">GCN<span>图神经网络</span></th><td class="num">3.77</td><td class="num">2.79</td></tr>
        <tr><th scope="row">Gemma<span>纯文本语言模型</span></th><td class="num">3.18</td><td class="num">2.50</td></tr>
        <tr class="is-highlight"><th scope="row">VisionEV<span>卫星影像 + 文本</span></th><td class="num">2.87</td><td class="num">1.98</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>在预留测试样本上的预测误差，单位为每站每周的充电次数（越低越好）。RMSE（均方根误差）对大偏差更敏感，MAE（平均绝对误差）是平均偏差。数据来自论文表2。</figcaption>
</figure>

**只用少量数据也能学得好。** 只用5%到20%的训练数据时，VisionEV在每个数据量下都领先所有模型，平均RMSE为3.30，LightGBM为3.53，纯文本模型为3.78。线性回归和图模型则基本失效（平均RMSE约为10到11）。

**在从未见过的站点上同样有效。** 这正是规划新站点时最关心的检验。我们随机选取20%、40%、60%或80%的站点训练，预测其余站点，模型从未见过测试站点的影像。VisionEV在每种划分下误差都最低。仅用20%的站点训练时，它在其余80%站点上的RMSE为3.98，优于LightGBM（4.19）和纯文本模型（4.22），误差波动也最小。

<figure class="figure-row">
  <img src="/media/song-visionev-trd-2026/zero-shot-20.png" alt="用20%站点训练时各模型RMSE柱状图（含误差线）：线性回归11.24，LightGBM 4.19，GCN 10.12，Gemma 4.22，VisionEV 3.98（最低）。" loading="lazy" />
  <img src="/media/song-visionev-trd-2026/zero-shot-80.png" alt="用80%站点训练时各模型RMSE柱状图（含误差线）：线性回归5.11，LightGBM 3.23，GCN 4.01，Gemma 3.24，VisionEV 3.18（最低）。" loading="lazy" />
  <figcaption>在训练中从未见过的站点上的误差（RMSE均值±标准差，越低越好）。左：用20%站点训练、在其余80%上测试；右：用80%训练、在20%上测试。两种情况下VisionEV（最右侧柱）都最低。图片来源：论文。</figcaption>
</figure>

它的偏差也更均衡。与LightGBM相比，VisionEV的误差更紧密地集中在零附近、分布更对称，而LightGBM的误差略微偏向一侧。对需要给站点排序的规划人员来说，一个不会系统性偏高或偏低的模型，即使平均误差相近，也可能改变哪些站点进入候选名单。

<figure class="figure-row">
  <img src="/media/song-visionev-trd-2026/residuals-20.png" alt="用20%站点训练时LightGBM（蓝色实线）与VisionEV（橙色虚线）预测残差的两条钟形曲线，VisionEV曲线略高，更靠近零。" loading="lazy" />
  <img src="/media/song-visionev-trd-2026/residuals-80.png" alt="用80%站点训练时的同样对比，VisionEV曲线同样更高、更靠近零。" loading="lazy" />
  <figcaption>在未见过的站点上，预测值偏离实际值的分布：LightGBM（蓝色实线）对比VisionEV（橙色虚线）。左：用20%站点训练；右：用80%训练。图片来源：论文。</figcaption>
</figure>

**在城市中差异很大的区域之间也能迁移。** 堪萨斯城市中心的91个站点与郊区站点在土地利用和交通条件上差别很大。用市中心训练、在郊区测试，以及反过来，VisionEV的误差都最低（RMSE分别为3.44和3.41，LightGBM为3.52和3.46）。与用全市数据训练相比，它的RMSE上升了约19%，与LightGBM（约20%）相当或更低，远低于线性回归和图模型（约38%至52%）。

**每个组件都不可或缺。** 每次去掉一个组件，并对全量数据、少量数据和未见站点三种测试取平均：

<figure>
  <div class="table-scroll">
    <table class="compare-table is-compact">
      <thead>
        <tr><th scope="col">模型版本</th><th scope="col" class="num">平均RMSE</th><th scope="col" class="num">平均MAE</th></tr>
      </thead>
      <tbody>
        <tr class="is-highlight"><th scope="row">完整的VisionEV</th><td class="num">3.22</td><td class="num">2.29</td></tr>
        <tr><th scope="row">去掉专家式提示词</th><td class="num">3.43</td><td class="num">2.43</td></tr>
        <tr><th scope="row">去掉卫星影像</th><td class="num">3.95</td><td class="num">2.84</td></tr>
        <tr><th scope="row">不做微调<span>直接使用现成的PaliGemma</span></th><td class="num">4.46</td><td class="num">3.34</td></tr>
        <tr><th scope="row">不用预训练<span>从零开始训练</span></th><td class="num">9.57</td><td class="num">7.02</td></tr>
      </tbody>
    </table>
  </div>
  <figcaption>各组件的贡献（越低越好）。去掉卫星影像后，平均RMSE从3.22升至3.95；预训练模型自带的通用知识作用最大。结果为全量数据、少量数据和未见站点三种测试的平均值，来自论文表4。</figcaption>
</figure>

**运行成本低。** 在一块GPU上为2,856个验证样本打分用时413秒，每个“站点×周”约0.15秒，因此1万个候选站点大约需要24分钟。每个站点的影像特征只需计算一次，之后换一周或换一个季节，只是换一行文字而已。预测只需8 GB显存的GPU，微调约需24 GB。

## 这项研究可以用来做什么？

- **筛选多得多的候选站点。** 城市、交通部门、电力公司和充电运营商的规划人员，可以只用公开影像和几项规划数据为每个候选站点打分，再只派人去踏勘入围名单。论文本身也给出了建议：如果只需要在一个标注完整的数据集上取得最低的平均误差，调好的LightGBM可能就够了；当站点是新建的、数据稀缺，或者人工编码周边环境成本很高时，VisionEV的价值最大。
- **充电历史数据很少的地方。** 由于它在小样本和未见站点上表现良好，这一方法适合早期部署、较小的城市，以及目前充电桩很少的社区，这对公平地推进充电网络建设很重要。
- **不只适用于堪萨斯城。** 输入只有卫星影像、交通或出行指标以及日期，这些数据都很容易获得。论文提出的下一步工作包括：测试其他图像编码器和视觉-语言模型，以及在多个城市之间进行训练和检验。
