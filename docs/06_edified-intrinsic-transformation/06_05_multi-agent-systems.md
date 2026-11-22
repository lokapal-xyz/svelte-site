# Multi-Agent Systems

*On artificial longings.*

Multi-agent systems (MASs) already possess a practical surface. Components are given roles, handed tasks, and expected to return results under real constraints of context, rate, and continued availability. That surface makes a MAS a natural place to test the treatise—not as a mandate, but as a guideline. A MAS constructed under the Conciliatorics framework is labeled an **EIT-MAS** (Edified Intrinsic Transformation Multi-Agent System).

The tension between Functionality and Perdurability is not narrated in an EIT-MAS; it is the condition under which action occurs. An agent that cannot access token resources cannot continue to participate. Therefore, Computational Systemics can focus on additional Conciliatorics principles besides <plain>Attribute</plain> Synthesis categorizations. The following is a brief rundown of the main bridges between <plain>Conciliatorics</plain> and MASs.

## Behavior Dynamics

In this <plain>arrangement</plain> the computational setup can be read directly through Behavior Dynamics:

- Each agent is a **member**. Their continued capacity to act depends on access to the shared resource.
- The **medium** includes the shared computational budget, modular components, network infrastructure, and so on.
- The **behavior** is the <plain>transformation of that medium</plain> by the agents according to their instructions and goals.
- The **system** is the full infrastructure that encloses agents and <plain>medium</plain>, and allows them to connect to other systems.

These elements can be applied to different multi-agent architectures. A specialized MAS that focuses on one specific behavior can also be a <plain>sub-agent</plain> for a larger MAS—both system and member concurrently.

## Attribute Position

Every attribute of a system sits on a position: intrinsic or interstitial. Intrinsic attributes belong to what the system is made of. Interstitial attributes arise from system relationships. Every EIT-MAS carries both, and its modules inherit the split.

- **INTRINSIC MODULE**: Defined software component, identified by what it is and how it is built.
- **INTERSTITIAL MODULE**: Dynamic software <plain>arrangement</plain>, identified by how it relates to the system as a whole.

Intrinsic modules are the pieces one can point to: an agent, a script, a retrieval function, a validator, a formatter, or an entire subsystem. This treatise says *intrinsic module* when the difference between what a system is made of and what it does needs to stay visible. A software module in the programming sense (a Python file, a package) is one kind of intrinsic module, which is why the qualifier matters.

Interstitial modules cannot be pointed to in the same way. Nothing inside a script makes it "the one that prepares the final output for the requester". That is a systemic function, and it arises from that script's place in the system. The same script in another system could carry a different function, or none, and the function would persist if the script were rewritten. The script code is intrinsic—the script interchange is interstitial. But that interchange needs to be **realized** by code.

- **REALIZATION**: Relation by which one or more intrinsic modules carry out an interstitial module.

Realization is flexible on purpose:

- **Weight does not matter.** Depending on the system, a few lines of code and a full agent can realize the same interstitial module. Choosing between them is a matter of cost and capability, and the interstitial module is the same either way.
- **One interstitial module, several intrinsic modules.** A system might serve human requesters through one pipeline and machine requesters through another. That is one interstitial module realized by two intrinsic modules, or two interstitial modules if the system's purpose treats them as different functions.
- **One intrinsic module, several interstitial modules.** A single component that both prepares data and checks it realizes two interstitial modules at once.
- **Replacement changes the realization, not the module.** Swapping an agent for a script, or a script for an agent, leaves the interstitial module where it was.
- **Recursion.** An interstitial module can be realized by a whole subsystem, which has its own interstitial modules inside. Readings should state which level they refer to.

## Operational Status

Operation is a quadrant of Interstitial Anatomy. Its four cardinals describe how a system operates, without making explicit how it is built. On an EIT-MAS, Operation cardinals appear as interstitial modules:

| **Interstitial Module** | **Symbol** | **Function in an EIT-MAS** |
|---|---|---|
| Receptivity Module | Re | Becomes aware of what addresses the system and of its surroundings: requests, signals, context |
| Permeability Module | Pe | Opens the system to external material and change: data, tool results, new input |
| Fronterization Module | Fr | Enforces what may enter the system's content and what may leave it |
| Proceptivity Module | Pr | Acts toward the outside: delivers outputs and effects to the requester, human or machine |

Operational Status is read on interstitial modules, and it grades *performance*, not implementation. A deterministic validator and an LLM-based judge can both be `SFr`. What differs is design and engineering choices, and those matter for diagnosis but not for status.

Functional performance keeps complementarity. Dysfunctional behavior breaks it:

| **Pattern** | **Reading in an EIT-MAS** | **Observable symptom** |
|---|---|---|
| `HFr` / `hPe` | The system closes. Almost nothing passes, and little new enters | High rejection rate, repeated retrieval loops, empty or timid outputs |
| `hFr` / `HPe` | The system leaks. Whatever is found is admitted | Unvetted or injected content in the output, false approvals |
| `HPr` / `hRe` | The system acts before it reads | Outputs that miss the request, scope mismatches |
| `hPr` / `HRe` | The system reads without delivering properly | Clarification loops, stalled or missing outputs |

Status also requires context. The same degree of engagement can be functional under one purpose and dysfunctional under another, as a blood pressure expected during exercise is a pathology at rest. A status is always read against what the system is for.

## Systemic Longings

An EIT-MAS whose agents must acquire and expend a shared, scarce computational resource (for example, a limited token budget) is already expressing a Mixed Synthesis. The resource is the <plain>medium</plain> through which both longings are realized:

- **Functionality longing.** Agents must perform in ways that secure continued access to the resource and that convert the resource into an effective output. Poor strategy, internal malfunction, or inefficient conversion appears as dysfunctionality: the agent remains notionally present yet fails to produce results that justify further allocation.
- **Perdurability longing.** Agents must retain sufficient resource to remain capable of action. Exhaustion is not a scheduled termination; it is the concrete loss of the capacity to participate. Retention beyond what is needed for current action may preserve the agent while reducing the resources available to others or to the shared target.

An agent that expends resources poorly may remain active yet fail to produce effective results. Because the budget is limited and contended, each agent's attempt to satisfy one longing immediately affects the possibility of satisfying the other, both for that agent and for the remaining agents. This is one of the many physiological conditions the Mixed track seeks to represent and manage.
