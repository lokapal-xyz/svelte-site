# Coordinator Pattern

*On embodiments.*

One widely used MAS <plain>arrangement</plain> has a Coordinator, a Researcher, a Judge, and a Writer. It is the <plain>arrangement</plain> in which the four interstitial modules of an EIT-MAS are most readily exposed, because each one is realized by an agent of its own. It is not the definition of an EIT-MAS. It is one <plain>arrangement</plain> among many, and this section reads it through the framework of the previous one.

The difference from a role-based reading matters. Permeability is not the Researcher. The Researcher is an intrinsic module, and it realizes the interstitial Pe Module. The same holds for the other three.

## Realization

| **Intrinsic Module** | **Realizes** | **What it does** |
|---|---|---|
| Coordinator agent | Re Module | Receives the request and decides whether it can be engaged with, establishes which agents are available, and directs the request to where it belongs |
| Researcher agent | Pe Module | Opens to external material and selects what is relevant |
| Judge agent | Fr Module | Applies standards to what the Researcher returns and decides what may enter the final content |
| Writer agent | Pr Module | Takes the approved material and produces the output for the requester |

The Coordinator also delegates. Receptivity is a living process, like a receptionist at a large building: it confirms that a request can be engaged with, declines what cannot be (the illegal, the out-of-scope, the premature), establishes who or what is available, and directs the request to where it belongs. All of this is adjudication of the arriving request, made at the point of contact, and it belongs to the Re Module. A visitor with a valid appointment can still be declined at the door, and that decision is Receptivity, not Fronterization.

What the system will hold and emit once it engages (which retrieved material is admissible, which content may reach the requester) is Fronterization, and it is decided by the Judge. The distinction lies in the object of the decision: the arriving request for Re, the system's content and commitments for Fr. The mechanical dispatch (message passing, retries, state) belongs to the system and the medium. A fixed pipeline carries that machinery in plain code, and its Re Module is correspondingly thin.

## Axes and hemispheres

Because the pattern gives each interstitial module its own agent, the compass relations can be read directly in the agents:

| **Operation Area** | **Interstitial Modules** | **Realized by** | **Reading** |
|---|---|---|---|
| Identity Axis | Pe, Fr | Researcher, Judge | A better Researcher makes the content more comprehensive. A better Judge makes it more accurate |
| Participation Axis | Re, Pr | Coordinator, Writer | A better Coordinator understands the request more fully. A better Writer delivers content that satisfies it |
| Individual | Pr, Fr | Writer, Judge | The Judge evaluates according to the request; the Writer produces according to it |
| Community | Re, Pe | Coordinator, Researcher | The Coordinator understands its agentic <plain>community</plain>; the Researcher accesses the communal data |
| Orientation | Re, Fr | Coordinator, Judge | The Coordinator orients the delegation; the Judge orients the content's accuracy |
| Navigation | Pr, Pe | Writer, Researcher | The Researcher navigates the available data; the Writer navigates the communication with the user |

## Other realizations

The reading survives when an agent is replaced, because the interstitial module stays and only its realization changes:

| **Interstitial Module** | **Agentic realization** | **Lighter realizations** |
|---|---|---|
| Re | Coordinator agent | Fixed intake parser, request schema check |
| Pe | Researcher agent | Retrieval function, data supplied directly by the requester |
| Fr | Judge agent | Schema validator, source allow-list, date filter |
| Pr | Writer agent | Formatter script, serializer |

A Writer agent is the right realization when the requester is a person who needs a sophisticated reply. When the requester is another system that expects a schema, a serializer realizes the same Pr Module with less cost and less distortion. Status moves only if performance moves. A lighter realization can still fall into a Hypo state if the purpose outstrips it, as when a schema validator is asked to catch factual errors it cannot see.

## Status in the pattern

The dysfunctional patterns of an EIT-MAS take concrete forms here:

- **`HFr` / `hPe`.** The Judge rejects nearly everything. The Researcher stays busy, but the system's openness is starved, and the loop between them consumes the budget.
- **`hFr` / `HPe`.** The Judge approves nearly everything. The Researcher's openness stops being filtered, and unvetted or injected content reaches the Writer. Hostile content found in retrieved material is a Fronterization failure.
- **`HPr` / `hRe`.** The Coordinator admits a request it should have declined (the illegal, the out-of-scope), or passes a poor reading of the request along, or the Writer produces before approved material exists. The pipeline engages on something that should not have passed the door, or the output is fluent and misses the request. A hostile prompt at the door is a Receptivity failure.
- **`hPr` / `HRe`.** The Coordinator keeps reading and clarifying while nothing is delivered.

A separate case is an agent that takes on a second module's function. A Judge that begins producing the user-facing answer realizes Fr and part of Pr at once. That is a realization choice, and it is not a status by itself. It matters if the Fr function degrades because of it, which is `hFr`, or if two intrinsic modules now compete to realize Pr. Status is still read on each interstitial module separately.

The tension between longings is visible in this pattern. A strict Judge serves Functionality, since it makes the content more accurate. Its loops with the Researcher spend the shared budget, which threatens the Perdurability of every module that depends on it. Operational Status does not settle that tension. It names where it is being felt.

The Coordinator Pattern is not privileged. It is the <plain>arrangement</plain> in which the compass is easiest to see, and for that reason it is a good first place to test whether the framework can read a MAS before moving on to arrangements where the four modules are harder to find.
