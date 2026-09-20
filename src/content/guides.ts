export interface GuideMeta {
  slug: string;
  relatedIds: string[];
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'emergency',
    relatedIds: ['e1', 'e2', 'e3', 'e4', 'e7'],
  },
  {
    slug: 'car-accident',
    relatedIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
  },
  {
    slug: 'housing',
    relatedIds: ['h1', 'h2', 'h3', 'h4', 'g1'],
  },
  {
    slug: 'legal-finance',
    relatedIds: ['l1', 'l3', 'l4', 'l5', 'l6', 'l2'],
  },
  {
    slug: 'civil-admin',
    relatedIds: ['g1', 'g2', 'g4', 'g3'],
  },
  {
    slug: 'family-welfare',
    relatedIds: ['f2', 'f3', 'f4', 'f6', 'f5'],
  },
];

export function getGuideBySlug(slug: string): GuideMeta | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
