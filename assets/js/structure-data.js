/* Council Society 2026 — Organizational Structure dataset
   Five interconnected layers + one independent guardian layer.
   Used by structure.js to render the interactive, searchable hierarchy. */

var STRUCTURE = [
  {
    id: 'core-council',
    label: 'Layer 1',
    title: 'Core Council',
    subtitle: 'Central Intelligence Layer',
    color: 'gold',
    role: 'Understanding, not authority. The intellectual and ethical centre of the society.',
    description: 'A group of domain experts and mentors who do not work in parallel, but teach each other \u2014 building a shared, holistic picture of the world\u2019s interconnected crises through continuous cross-disciplinary dialogue.',
    children: [
      { id:'cc-role', title:'Role', isNote:true, description:'Holds insight through dialogue, not instructions through command. The Core Council sets direction by understanding reality more completely \u2014 never by issuing orders to the circles below it.' }
    ]
  },
  {
    id: 'domain-circles',
    label: 'Layer 2',
    title: 'Domain Circles',
    subtitle: 'Expert-Led Knowledge Units',
    color: 'teal',
    role: '5\u201330 contributors per circle: students, researchers, practitioners, volunteers, and analysts.',
    description: 'Each Core Expert leads a circle of contributors who conduct research, collect data, run field studies, and develop reports \u2014 generating knowledge from the ground up rather than receiving it passively.',
    children: [
      { id:'dc-climate', title:'Climate & Environment', description:'Research on ecological breakdown and its cascading effects on food, economy and migration.' },
      { id:'dc-health', title:'Health & Medicine', description:'Evidence-based public health communication and medical literacy.' },
      { id:'dc-tech', title:'Technology, AI & Data', description:'Understanding how emerging technology reshapes work, truth, and power.' },
      { id:'dc-education', title:'Education', description:'Closing the gap between what is taught in schools and what is true about the world.' },
      { id:'dc-economics', title:'Economics & Policy', description:'Tracing how economic structures produce \u2014 or relieve \u2014 everyday crises.' },
      { id:'dc-psychology', title:'Psychology & Mental Health', description:'Understanding the human mind under chronic uncertainty and crisis.' },
      { id:'dc-philosophy', title:'Philosophy & Ethics', description:'Asking what we owe each other, and on what evidence we should believe anything.' },
      { id:'dc-social', title:'Social Systems & Culture', description:'How belief, tradition and culture shape \u2014 and sometimes block \u2014 collective response.' }
    ]
  },
  {
    id: 'synthesis-forum',
    label: 'Layer 3',
    title: 'Integration & Synthesis Forum',
    subtitle: 'Cross-Field Bridge \u2014 \u201cThe Sense-Making Chamber\u201d',
    color: 'emerald',
    role: 'Representatives from every Domain Circle, guided by the full Core Council.',
    description: 'Purpose: integrate insights from all Domain Circles into one unified understanding that no single circle could reach alone.',
    children: [
      { id:'sf-1', title:'Combine research findings', description:'Bringing climate data, economic analysis, and psychological research into the same room, examined together.' },
      { id:'sf-2', title:'Identify systemic patterns', description:'Finding the patterns that cut across fields rather than within them.' },
      { id:'sf-3', title:'Produce interdisciplinary reports', description:'Translating combined findings into a single, honest account of reality.' },
      { id:'sf-4', title:'Align projects across circles', description:'Keeping every circle\u2019s work pointed at the same shared picture.' }
    ]
  },
  {
    id: 'outreach',
    label: 'Layer 4',
    title: 'Action & Outreach Layer',
    subtitle: 'Impact Interface',
    color: 'teal',
    role: 'Carries integrated understanding from the Synthesis Forum out into the world, in forms suited to different audiences.',
    description: 'Six units working from the same shared understanding \u2014 not separate departments, but different translations of one source.',
    children: [
      { id:'ou-research', title:'Research & Publications Unit', description:'Reports, articles, and books that document the society\u2019s findings.' },
      { id:'ou-comms', title:'Public Communication Unit', description:'Social media, campaigns, and public dialogues that reach a general audience.' },
      { id:'ou-education', title:'Education & Literacy Unit', description:'Workshops and accessible content built with schools and institutions.' },
      { id:'ou-community', title:'Community & Field Projects Unit', description:'On-the-ground research, pilot programs, and direct community engagement.' },
      { id:'ou-media', title:'Media & Documentation Unit', description:'Documentaries and field video that bring distant realities into public view.' },
      { id:'ou-policy', title:'Policy & Institutional Engagement Unit', description:'Engaging schools, institutions, and policymakers directly.' }
    ]
  },
  {
    id: 'admin',
    label: 'Layer 6',
    title: 'Administrative & Operations Layer',
    subtitle: 'Support System',
    color: 'gold',
    role: 'Supports thinking and action \u2014 does not control them.',
    description: 'The infrastructure that lets every other layer focus on its actual work.',
    children: [
      { id:'ad-1', title:'Coordination & Scheduling', description:'Keeping circles, forums and outreach units moving in step.' },
      { id:'ad-2', title:'Documentation & Archiving', description:'Preserving the society\u2019s research and institutional memory.' },
      { id:'ad-3', title:'Funding & Resource Management', description:'Stewarding grants, donations and operating budgets responsibly.' },
      { id:'ad-4', title:'Legal & Compliance', description:'Registration, governance, and regulatory standing.' },
      { id:'ad-5', title:'Technology & Platforms', description:'The tools and systems the rest of the society runs on.' }
    ]
  }
];

var GUARDIAN = {
  id: 'ethics-circle',
  label: 'Layer 5 \u00b7 Independent',
  title: 'Ethics & Integrity Circle',
  subtitle: 'Guardian Layer',
  color: 'navy',
  role: 'Sits outside the hierarchy. Reviews, never directs.',
  description: 'Ensures truthfulness, transparency and ethical conduct across every layer \u2014 preventing bias, maintaining independence from political or commercial pressure, and resolving conflicts before they spread. Every public claim the society makes passes through the standard this circle maintains.'
};

var AUTHORITY_FLOW = [
  'Research from Domain Circles',
  'Integration via the Synthesis Forum',
  'Guidance from the Core Council',
  'Ethical review where required (Ethics & Integrity Circle)',
  'Execution by Action & Outreach units'
];
