---
layout: paper
title: "Evaluation Methodology of Leader-Follower Autonomous Vehicle 
        System for Work Zone Maintenance"
authors: "Qing Tang, Yanqiu Cheng, Xianbiao Hu, Chenxi Chen, 
          Yang Song, Ruwen Qin"
year: 2021
journal: "Transportation Research Record"
volume: "2675(5)"
pages: "107–119"
doi: "https://doi.org/10.1177/0361198120985233"
status: "Published"
category: "Automated Vehicles"
subcategory: "CDA for Work Zone"
code: "https://github.com/xbhu/AV-WorkZoneCDA-testing/tree/main"
ppt: "https://github.com/xbhu/AV-WorkZoneCDA-testing/blob/main/ATMA%20Field%20Testing_TRR%202021%20slides.pdf"
PDFdownload: "https://github.com/xbhu/AV-WorkZoneCDA-testing/blob/main/ATMA%20Field%20Testing_TRR%20paper%202021.pdf"
video: "https://www.youtube.com/watch?v=O1Vrhn0wct8"
citation_apa: "Tang, Q., Cheng, Y., Hu, X., Chen, C., Song, Y., & Qin, R. (2021). Evaluation methodology of leader-follower autonomous vehicle system for work zone maintenance. Transportation Research Record, 2675(5), 107–119. https://doi.org/10.1177/0361198120985233"
---

## 这项研究解决了什么问题？

公路养护工人每天都面临严重的安全风险。划线、补坑、冲洗桥梁等移动作业需要在高速公路上低速行驶，这种工况极易引发交通事故。仅2017年一年，美国施工区域(Work Zone, 以下简称工区)就发生了158,000起交通事故，造成61,000人受伤，其中许多是各州交通运输厅（DOT）的工作人员。

**自动驾驶卡车防撞缓冲车（ATMA）**系统正是为消除这一风险而设计的。它采用**领航-跟随协同自动驾驶（CDA）**架构：由人工驾驶的领航车（LT）执行养护作业，无人驾驶的跟随车（FT）通过车辆间通信（V2V）自动跟踪领航车的位置、速度和行驶方向。跟随车尾部安装有卡车防撞缓冲器（TMA）——一旦发生追尾碰撞，TMA将承受冲击，从而保护DOT工作人员的人身安全。该系统在严格限定的作业环境中运行（低速移动作业、封闭或管控车道），是目前最具实际落地前景的自动驾驶技术应用场景之一。

到2019年，包括科罗拉多州和密苏里州在内的多个州DOT已开始购置和部署ATMA车辆。但一个关键问题仍未得到解答：**该系统在真实条件下的实际表现如何？我们又该如何严格地量化评估？** 此前尚无学术评估框架。本文正是为填补这一空白而作。

## 我们做了什么？

ATMA系统允许操作员设置关键运行参数，例如领航车与跟随车之间的跟车间距和行驶速度。但参数的设定与实际实现之间存在差距。在直路上以10英里/时行驶时，100英尺的跟车间距或许容易维持——但在弯道上呢？变道时呢？领航车紧急制动时呢？GPS信号丢失时呢？

这些正是各州DOT在决定全面部署之前迫切需要得到答案的问题。

我们与密苏里DOT合作，于2019年在佛罗里达州Fort Walton Beach和密苏里州Sedalia开展了实地测试。测试涵盖四大类共31个场景：

- **通信中断**：无线信号失效、单路及双路V2V通信中断、传感器断连、GPS拒止环境
- **跟车精度**：直道、弯道、变道、环形交叉口、路面凸起障碍物、U形转弯
- **障碍物检测**：前方及侧方防碰撞
- **紧急情况**：紧急停车、人工接管、模拟追尾冲击、临时脱离与追回

所有可量化测试均重复进行三次以支持统计分析。我们随后建立了一套评估框架，将原始传感器日志数据转化为可量化、可辩护的性能结论。

## 这项研究可以用在哪里？

- **正在评估ATMA采购的DOT**：本文提供了一套完整的测试方案和性能基准，可直接参考或根据实际需求调整。
- **已部署ATMA的DOT**：统计评估框架可用于持续监测系统性能，及时发现性能退化。
- **研究AV实地评估的学者**：本文方法适用于任何在受限、明确定义的运行设计域（ODD）内运行的领航-跟随或CDA系统。

## 方法论的核心贡献是什么？

现有的自动驾驶车辆评估方法并非为实地测试的小样本重复测试结构而设计。我们围绕横向偏差误差（CTE）——即跟随车相对领航车预定路径的横向偏移量——建立了一套**三层评估框架**：

1. **统计特征分析**：针对每项测试，计算CTE的均值、标准差和分位数，并与密苏里DOT预定的性能标准（横向容差±6英寸）进行对比。
2. **概率分布分析**：落在可接受容差范围内的观测比例是多少？这将原始数据转化为具有层次的通过/失败结论——不仅判断系统是否达标，还能量化达标的裕度。
3. **Friedman非参数假设检验**：验证同一测试的重复运行是否产生统计上一致的结果，从而确认系统的**稳定性**，而非仅凭某次偶然表现。

选用Friedman检验的原因在于：实地测试数据不服从正态分布，且样本量有限——在这种条件下，参数检验方法并不适用。

## 关键发现是什么？

- 在大多数运行条件下，跟随车的横向精度维持在领航车路径**±6英寸**以内，满足密苏里DOT的性能要求。
- 当双路V2V无线通信同时中断时，跟随车在**1.9秒**内完全停车——这是一项关键安全性结论。
- 在GPS拒止环境下，航位推算系统（DRA）在触发受控停车前，可在**45秒内**将精度维持在±6英寸以内——完全符合设计要求。
- 假设检验证实了**所有重复测试中的统计一致性**，表明系统在受控条件下稳定可靠，并非偶然达标。
- 紧急转弯动作——环形交叉口和U形转弯——显示出较高的CTE，部分观测值达到**±10英寸**。这是部署规划中需要关注的重要操作边界：各机构在规划作业路线时应将转弯几何条件纳入考量。