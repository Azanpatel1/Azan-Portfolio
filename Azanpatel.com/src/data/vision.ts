export type VisionBlock =
  | { kind: 'p'; text: string }
  | { kind: 'question'; text: string }
  | { kind: 'note'; text: string }
  | { kind: 'list'; ordered?: boolean; items: string[] };

export interface VisionSection {
  index: string;
  title: string;
  blocks: VisionBlock[];
}

export const VISION_META = {
  title: 'Neuroengineering deserves its own footing',
  dateline: 'Journal entry — Friday, 11 September 2026',
  source:
    'Source: voice conversation, transcribed and consolidated. A working draft — the raw thinking behind the roadmap, not a polished statement.',
  readingNotes: [
    'Plain first-person text is my own words, cleaned of filler. Distinctive phrasings are kept verbatim in quotes.',
    'Q: marks an institution-style challenge question put to me. My answer follows.',
    'Sharpening: is a reframing of what I said — an editorial annotation, not my wording.',
  ],
  placement:
    'Where this sits: under the healthcare-system manifesto, as the "why the field" layer beneath roadmap step 1 — stroke speech rehabilitation via closed-loop stimulation.',
};

export const VISION_SECTIONS: VisionSection[] = [
  {
    index: '00',
    title: 'The premise, in one paragraph',
    blocks: [
      {
        kind: 'p',
        text: 'Neuroengineering deserves its own footing. My view of the world is that at some point the field gets big enough that it is its own standalone program — not a track, not an emphasis bolted onto bioengineering — and I want to make that transition happen. This entry is me thinking out loud about why, where the bottleneck actually is today, how the field gets to the next level, and how you would teach it. The strongest version of the argument is not about institutions. It is about the problem that cannot get solved because of where the field currently sits — and for me that problem is restoring speech after stroke.',
      },
    ],
  },
  {
    index: '01',
    title: 'Where the field is today, and why it sits inside bioengineering',
    blocks: [
      {
        kind: 'p',
        text: 'State of play: a handful of standalone neuroengineering doctoral programs now exist. UAB has a freestanding PhD in Neuroengineering, joint with its medical school. WashU recently launched a doctoral program in neuroengineering. Utah has a Neural Engineering PhD as its own program, alongside a neuroengineering track inside BME. But the common pattern is still a track or an emphasis: Pitt runs Neural Engineering within Bioengineering, UCSB adds a neuroengineering emphasis onto ChemE, CS, ECE, ME, DYNS or Psych, and Penn houses neuroengineering inside the Neuroscience Graduate Group.',
      },
      {
        kind: 'p',
        text: 'The steelman for the status quo — which I need an answer to, not a dismissal of: departments exist when there are enough faculty, enough undergraduate demand, and enough grant flow to justify them, and neuroengineering is still small enough that splitting it off produces a weaker unit than staying nested. And the tooling is shared. Electrode fabrication, biocompatibility, signal processing and implant packaging are the same engineering stack whether the target is the brain or the heart. On that view, the neuro-specific part is the target organ and the decoding, not the methods.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the shared-tooling argument is exactly the problem. It treats the brain as one more target organ for a general device stack. But what makes neuro hard is not the device — it is that you cannot design the intervention without understanding the system, and the system is the most complicated one we have.',
      },
    ],
  },
  {
    index: '02',
    title: 'The real bottleneck: information, not funding or politics',
    blocks: [
      {
        kind: 'p',
        text: 'The bigger bottleneck is the information required to solve the problem. To do closed-loop stroke rehabilitation — decode intent, trigger stimulation, drive plasticity — you need to be three people at once:',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'A neuroscientist who understands the anatomical and structural side of the brain.',
          'An engineer who understands the device, the physical constraints, and what devices can do what.',
          'Someone with the clinical background to launch this into a clinic and actually deploy it — who understands the patient’s needs and the clinic’s needs.',
        ],
      },
      {
        kind: 'p',
        text: 'It is not that the collaboration does not happen. It happens. It just happens slowly. There is fundamentally a communication bottleneck: each of these people speaks a different language. "If they all spoke the same language, we would be able to solve these problems better." You can catalyse solutions and discoveries if people genuinely were wearing all of these hats and were as knowledgeable as all these people put together.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the claim is about knowledge integration, not funding or politics — which is the stronger version, because bioengineering as a home teaches the device half and some of the clinical half, but never teaches the brain deeply enough to know what you are even decoding. The cost of translating between three languages is not just delay; it is the ideas that never get had, because nobody proposes a thing that sits in the gap between two vocabularies when nobody is standing in that gap. The three bodies of knowledge have to sit inside one head, not three collaborating heads.',
      },
    ],
  },
  {
    index: '03',
    title: 'Where I felt it: the weights-and-nodes model of the brain',
    blocks: [
      {
        kind: 'p',
        text: 'I came at the brain from my engineering background — the software and machine-learning interpretation of neuroscience, where you model each node as weights and build some model on top of that, whether it is Bayesian, stochastic, or fixed-weight. That view of the brain from the engineering side was an oversimplification. It did not consider glia, ganglia, the different anatomical structures and their functions, neurotransmitters and how they modulate — and not even just neurotransmitters, but things like BDNF, brain-derived neurotrophic factor. There are so many of these variables that an engineer is not knowledgeable about, and if they had a better understanding of them they could think about solving these problems in different ways.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the frame was not wrong so much as it quietly deleted everything that does not fit into a weight — neuromodulators, growth factors, the fact that the "wire" is a living thing that changes because you stimulated it. Plasticity is precisely the thing the abstraction throws away: a fixed-weight model has no room for the mechanism I am trying to exploit. One-line version: I had a model of the brain that made my tools look sufficient, and the gap I could not see was exactly where my problem lives.',
      },
    ],
  },
  {
    index: '04',
    title: 'Tools versus the system: knowing the modality is not knowing the target',
    blocks: [
      {
        kind: 'p',
        text: 'Second example: the current engineering tools and the mechanisms behind how they work. Electrical stimulation — inducing a current in the human body. Focused ultrasound — compression of sound waves to drive ion channels. In each case an engineer is designing something to interact with a biological system. But to truly solve these problems — to understand and then control these systems in a beneficial way — you need to understand the system you are trying to control, rather than just knowing the modalities and the tools that interact with it.',
      },
      {
        kind: 'p',
        text: 'The engineer’s education is organised around the tool. The problem is organised around the target.',
      },
    ],
  },
  {
    index: '05',
    title: 'How deep do you need to be? Problem-indexed depth',
    blocks: [
      {
        kind: 'question',
        text: 'You have argued the three bodies of knowledge need to sit in one head. But nobody can be world-class at all three, and a person spread across them risks being mediocre at each. Where do you need to be genuinely deep, and where is a working literacy enough to ask the right question of someone deeper?',
      },
      {
        kind: 'p',
        text: 'It is dependent on the problem you are trying to solve. You have some problem, and you ask the right, necessary questions needed to solve that problem. This is very much an engineer’s way of understanding it: ultimately you will have some black boxes and some models, and it is a question of whether the questions you are asking are enough. You can infinitely, recursively ask yourself questions and try to better understand the system. Functionally, you ask yourself enough to solve the problem you are trying to solve.',
      },
      {
        kind: 'p',
        text: 'The other half is providing that information density to the people who are asking those questions. If someone is trying to solve Alzheimer’s — provide them the information density, "project that onto their brain": the understanding of the brain, the resources that let them find the answers, research and understand the mechanisms that govern the problem they are looking to solve. Once you understand that, you use the existing tools — and create new tools — to solve the problem.',
      },
      {
        kind: 'note',
        text: 'Sharpening: depth is problem-indexed, not curriculum-indexed. You go as deep as the problem demands and then stop, and the black boxes you leave are deliberate rather than accidental.',
      },
    ],
  },
  {
    index: '06',
    title: 'How you teach this: compress the source of the problem',
    blocks: [
      {
        kind: 'question',
        text: 'Problem-indexed depth works for one person solving one problem. A curriculum has to be designed before anyone knows which problem a student will end up facing. Do you just hand people a problem on day one and let the curriculum fall out of it?',
      },
      {
        kind: 'p',
        text: 'No. You allow people to actually interact with the world and identify a problem, and out of that curiosity, the questions rise.',
      },
      {
        kind: 'p',
        text: 'For me: I had the opportunity to explore problems and learn about stroke aphasia — the problem these patients are having, and the problem the clinics are having. For the patients, there is a disconnect between their internal cognition and their output, their ability to communicate it with the external world. Working on that problem gave me a better understanding of what questions to ask and what modalities would let me solve it. And then talking to the clinics. "You fundamentally have to interact with and compress the source of the problem."',
      },
      {
        kind: 'note',
        text: 'Sharpening: the curricular answer is exposure first, questions second, coursework third — close to how medicine trains, and almost the inverse of how engineering does.',
      },
    ],
  },
  {
    index: '07',
    title: 'What the literature cannot tell you: agency',
    blocks: [
      {
        kind: 'question',
        text: 'What did you learn about stroke aphasia that surprised you — something you only got by being in the room, that you would never have got from the literature?',
      },
      {
        kind: 'p',
        text: 'How the people and patients actually feel about these technologies. You can create the perfect solution in terms of solving the problem from an academic and engineering point of view, but if the person who would be using it does not have an affinity toward it, or it does not fit their needs, then it is pointless. Having an objective, an endpoint, and knowing what questions are worth asking and where they are going — that is really the biggest thing.',
      },
      {
        kind: 'p',
        text: 'Specifically with stroke aphasia: these patients are not fans of assistive technology. "It removes their agency." This is firsthand — a lot of these patients have said that when they use assistive tools that communicate for them, it feels like a loss of agency, that their identity of self is not being preserved. That is why I so wholeheartedly believe we should be preserving that agency and "giving them back their function" through the technology, rather than "scaffolding around the problem, putting a Band-Aid on it."',
      },
      {
        kind: 'note',
        text: 'Sharpening: restore function versus substitute for it — and the reason is not performance, it is identity. A device that speaks for you communicates, and still takes something from you. It also justifies the entire technical bet: plasticity-driven restoration is harder and slower than a good assistive interface, and the only reason to take the harder path is that agency is the endpoint, not throughput.',
      },
    ],
  },
  {
    index: '08',
    title: 'Band-Aids and ceilings',
    blocks: [
      {
        kind: 'question',
        text: 'Is there any case where you would accept substitution? Someone who will not recover function — do they get the Band-Aid?',
      },
      {
        kind: 'p',
        text: 'Yes. When you are implementing a solution today you have to consider the trade-offs. If there is a solution that can help slightly — of course, apply the Band-Aid. Let us help people as much as possible; these patients would prefer a Band-Aid over no solution. But we need to be thinking bigger: how do we get to the root of the problem and actually help these people as much as possible, rather than just applying a Band-Aid.',
      },
      {
        kind: 'note',
        text: 'Sharpening: help now, but do not let the Band-Aid become the ceiling of ambition. The honest risk: assistive tech is what most patients will actually have in their hands for the next decade or two, so the restoration bet has to be argued on a real timeline, not just on principle.',
      },
    ],
  },
  {
    index: '09',
    title: 'This is already clinically real — the bottleneck is access, not science',
    blocks: [
      {
        kind: 'question',
        text: 'Do you have a view on when plasticity-driven restoration becomes clinically real?',
      },
      {
        kind: 'p',
        text: 'It is already clinically real. It is just not specifically used in speech restoration. Closed-loop neural stimulation is not a new, novel, barely-applicable technology — we have been using it. Motor rehabilitation. TMS. Peripheral nerve stimulation for motor recovery. Countless other technologies that have now been commercialised, including implantable devices that interfere with pain signalling so the pain reaching the brain is nullified.',
      },
      {
        kind: 'p',
        text: 'But all of this still relies heavily on surgery — the whole process of surgical equipment and a surgical procedure — and that does not help the large majority of patients who are suffering from these diseases and are not willing to go through surgery, or who do not pass the threshold of even going to the doctor. That is one of the biggest reasons people are underserved: the problem is not at a level that warrants surgery and a complex medical process. But that does not mean they cannot benefit from solutions that address it noninvasively, or with a lower risk-to-reward profile. That is where a majority of these people are sitting — they have an issue they are facing, and "the current solutions only address the most acute versions of it." These treatments are very expensive. If we can make it more accessible, cheaper for these patients, and target a wider variety of problems, that would be the best thing.',
      },
      {
        kind: 'note',
        text: 'Sharpening: this reframes the bet entirely. It is not "restoration is coming"; it is "restoration is here, but gated behind surgery, cost, and severity thresholds." The unmet need sits in the middle of the distribution — real deficit, not severe enough for anyone to offer surgery — not in the tail. That is an access claim, not a futurism claim.',
      },
    ],
  },
  {
    index: '10',
    title: 'Pushback: does the middle of the distribution just recover on its own?',
    blocks: [
      {
        kind: 'question',
        text: 'A sceptic says some of that middle group improves with conventional therapy alone — so you are intervening where nature and a speech therapist would have got there anyway. Have you run into that?',
      },
      {
        kind: 'p',
        text: 'Not really, because that is just not how it works. These patients will minimally recover. They spend months going through these therapies just to have marginal improvements — there are many papers showing, with actual quantitative metrics scoring the effectiveness of these therapies, that the improvements are very marginal. And they typically keep doing the therapy. I was talking to a patient who has been doing this for over a year and has not benefited, or only very lightly. The problem is not solved by doing more traditional therapy. "There is a ceiling. There is a bottleneck." And it has been shown not just by the literature but also by talking to these people.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the literature is what neutralises the objection and the patient story is what makes it land. Lead with the numbers, close with the person who has been at it for a year.',
      },
    ],
  },
  {
    index: '11',
    title: 'The 3 a.m. worry: the actuator',
    blocks: [
      {
        kind: 'question',
        text: 'What is the strongest argument against your whole approach — the one that genuinely worries you?',
      },
      {
        kind: 'p',
        text: 'The efficacy of the modality I am using — vagus nerve stimulation. The literature shows it could make an improvement, but is this going to be the most improvement? Maybe focused ultrasound will be even better.',
      },
      {
        kind: 'p',
        text: 'But the architecture is fundamentally what is addressing the problem. VNS is just "the current exploit modality" — the actuator I am exploiting today — and it could be swapped out for a more effective one. Which actuator is best is still an open question I am actively looking into, and it is a motivating factor for wanting the resources to explore the different options.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the worry is not whether closed-loop plasticity works; it is whether the right actuator has been picked. The strong version of the position is that the decoding, the timing, the closed loop is the contribution, and the stimulator is swappable. "Which actuator best drives plasticity in a closed loop, and what determines that" is a PhD-shaped question in a way that "build my device" is not. It also explains why I want a lab rather than more engineering hours.',
      },
    ],
  },
  {
    index: '12',
    title: 'If I were chairing the programme',
    blocks: [
      {
        kind: 'question',
        text: 'If you designed the neuroengineering programme you have been describing, what is the one thing you would do that no existing programme does?',
      },
      {
        kind: 'p',
        text: 'Combine an entrepreneurial-style understanding — access to the patients and the people currently facing the problem, so you actually interface with the end user and the clinical side — and use that to drive the engineering, the solutions, and the research questions.',
      },
      {
        kind: 'question',
        text: 'That is roughly what translational medicine and clinician-scientist programmes claim to do. What makes your version different from an MD-PhD already sitting in the clinic?',
      },
      {
        kind: 'p',
        text: '"Bandwidth." The MD-PhD is subject to a dense requirement of standard operating procedures, of applying this in a clinical setting, of working with patients to meet their day-to-day needs. Talking to these MD-PhDs, these physicians doing their practice and doing surgeries — they do not have the bandwidth to build these solutions or ask these research questions. This programme should be designed specifically for exploring the problem via the clinical lens, paired with the academic classes that give you the knowledge to understand it from the anatomical and medical side. "The goal is not to be a physician. It is to see the same problem the physician sees" — and then create the technologies and conduct the research that makes the step forward on these big, challenging problems.',
      },
      {
        kind: 'note',
        text: 'Sharpening: the distinction is job description, not knowledge. The MD-PhD’s clinical time is a service obligation; here it is diagnostic — you are in the room to find the problem, not to treat the patient in front of you. Same room, different purpose.',
      },
      {
        kind: 'question',
        text: 'Without patient-care duties, what keeps your students accountable to real clinical need rather than drifting into interesting-but-useless? And if a student has been in your programme two years, what would tell you they are actually anchored?',
      },
      {
        kind: 'p',
        text: 'A partial answer, not a complete one. You fundamentally have to care about the patient’s needs and about finding problems. Index on people who are curious and willing to talk to people, and patients who are willing to talk to them. For selection: index on someone who has experienced a problem, who personally has some relationship with the problem. And then formalise the discovery process — metrics they would be meeting, having them write up the discoveries and why: what are they actually doing?',
      },
      {
        kind: 'note',
        text: 'Proposal: make the problem statement itself a defended artefact. Like a qualifying exam, but instead of defending your methods you defend that the problem is real — who has it, how many, what they have told you, why existing solutions cap out. Fail that, and you go back to the clinic rather than into the lab.',
      },
    ],
  },
  {
    index: '13',
    title: 'Why a PhD, and why not just the company',
    blocks: [
      {
        kind: 'question',
        text: 'You have said what you would build and why it matters. What does a PhD give you that running the company does not — what do you want to have learned that you cannot teach yourself?',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Which modality is going to best address the issue.',
          'The mechanisms behind how and why it works.',
          'Clinical access — patient sourcing, IRB support.',
          'Mentors — an academic stress test to guide the project.',
          '"I don’t know what I don’t know."',
          'A formal structure to work within, and to pass on later.',
        ],
      },
      {
        kind: 'note',
        text: 'Sharpening: the strongest line here is the fifth. A company optimises for shipping what you already believe; a lab is where someone senior tells you your belief is wrong before you spend three years on it. That is an epistemics request, not a resource request — file the rest under it.',
      },
    ],
  },
  {
    index: '14',
    title: 'Lines worth keeping verbatim',
    blocks: [
      {
        kind: 'list',
        items: [
          'If they all spoke the same language, we would be able to solve these problems better.',
          'You fundamentally have to interact with and compress the source of the problem.',
          'Providing that information density... projecting it onto their brain.',
          'It removes their agency.',
          'Giving them back their function, rather than scaffolding around the problem, putting a Band-Aid on it.',
          'The architecture is fundamentally what is addressing the problem. VNS is just the current exploit modality.',
          'The current solutions only address the most acute versions of it.',
          'There is a ceiling. There is a bottleneck.',
          'Bandwidth.',
          'The goal isn’t to be a physician. It’s to see the same problem the physician sees.',
          'I don’t know what I don’t know.',
        ],
      },
    ],
  },
  {
    index: '15',
    title: 'The argument’s spine',
    blocks: [
      {
        kind: 'list',
        ordered: true,
        items: [
          'Restoring speech after stroke needs neuroscience, device engineering, and clinical knowledge in one head; the handoffs between three languages cost ideas, not just time.',
          'I know because my engineer’s model of the brain deleted exactly the mechanism — plasticity — that my problem depends on.',
          'Patients told me the thing the literature does not: assistive tech takes agency. So the endpoint is restored function, not throughput.',
          'Closed-loop restoration already exists — it is gated by surgery, cost, and severity, and the underserved majority is in the middle of the distribution, where conventional therapy has a ceiling.',
          'The open question is the actuator, not the loop — a PhD-shaped question.',
          'What I cannot get from the company: mechanism, modality comparison, clinical access, and someone senior to tell me I am wrong.',
        ],
      },
    ],
  },
];
