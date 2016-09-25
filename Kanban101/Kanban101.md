# Kanban

???

 - We work with a Kanban board everyday, but does everyone understand what Kanban is?

---

# Agenda

1. What is Kanban?
  - Origins
  - Core Principles
2. Importance of WIP Limits.
3. How is it different from Scrum?

---

# What *is* Kanban?

--

.center[![Kanban at Acme Corp](img\KanbanAtAcmeCorp.jpeg)]

[*~John Cutler*][AcmeCorp]


???

 - This is, right?
 - It's more than a work board. It's a way of doing our work.

---

# What is Kanban?

--

 - Kanban is a Japaneese manufacuturing method, pioneered by Toyota in the 40's.

--

 - Literally translates to "visual sign" or "card".

???

- [Toyota line-workers used a kanban (i.e., an actual card) to signal steps in their manufacturing process. The system’s highly visual nature allowed teams to communicate more easily on what work needed to be done and when. It also standardized cues and refined processes, which helped to reduce waste and maximize value.][LeanKitKanban]

--

 - Inventory Manaagmenet System
--
 - When a worker runs out of a part, they send a kanban (card) back up stream to signal they need more.

???

- We use a Kanban system at our factory. When assembly needs more parts, they send a physical kanban card up the supply chain as a signal to send more.

--
 - Kanban is a ***pull*** system.

???

 - Instead of pushing work through the system, creating bottle necks, inventory is always *requested*. Never pushed.

This is all well and good, but...

---

# What does this have to do with software?

--

 .center[.shock[
 **THE BACKLOG IS INVENTORY**
 ]]


--

So we can use inventory management techniques to optimize the flow of inventory through our system.

---

# Four Core Principles

1. Visualize Work
2. Limit Work in Process
3. Optimize for Flow
4. Continuous Improvement

???

1. Visualizing the workflow (typically with Kanban board) we can instantly see bottlenecks that need to be addressed. If we pay attention, we'll also see the blocked items. Blocked items need to be unblocked as soon as possible. **Almost done isn't done.**

2. By limiting how much unfinished work is in process, you can reduce the time it takes an item to travel through the Kanban system. (Little's Law) You can also avoid problems caused by task switching and reduce the need to constantly reprioritize items.

3. Being busy doens't deliver value. Delivering working code into production does.

4. If you have an idea to improve our process, speak up now. (Well, not right *now*, after the presentation.) Don't wait for the retrospective to improve things.


---

# Visualize the Work

 - The Kanban board isn't just a visual status update.
 - It gives us a 30,000 ft. view of the state of the system.

--

 .center[
 ![Over Wip](img/OverWip.png)
 ]

???

 - Can anyone spot the bottleneck?
 - What should we do in this situation?

---

# WIP Limits



---

count: false
exclude: true

# References

[LeanKitKanban]:https://leankit.com/learn/kanban/what-is-kanban/
[AcmeCorp]:https://medium.com/@johnpcutler/real-world-kanban-a-cartoon-116fd37f14ac#.eu6lfj706