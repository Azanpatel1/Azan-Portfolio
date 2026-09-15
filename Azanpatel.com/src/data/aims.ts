export interface Aim {
  index: string;
  label: string;
  statement: string;
}

export const AIMS_META = {
  label: 'Research aims',
  title: 'Three aims: mechanism, translation, theory.',
  description:
    'The aims are deliberately coupled — the mechanism work feeds the clinic, the clinic constrains the model, and the model is how the mechanism gets communicated.',
};

export const AIMS: Aim[] = [
  {
    index: '01',
    label: 'Mechanism',
    statement:
      'Understand the mechanisms behind neuromodulation that give rise to overt human behavior, memory, attention, and latent human experience — via Aim 3 to communicate the findings.',
  },
  {
    index: '02',
    label: 'Translation',
    statement:
      'Explore the translation in a clinical setting to address stroke, Alzheimer’s, and neuropsychiatric disorders.',
  },
  {
    index: '03',
    label: 'Theory',
    statement:
      'Drive the development of a theoretical computational cognitive neurodynamical model that describes the lowest-abstraction mechanisms driving neuroplasticity and its effect on Aims 1 and 2.',
  },
];
