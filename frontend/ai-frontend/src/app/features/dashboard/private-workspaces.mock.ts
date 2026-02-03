import { Workspace } from '../../shared/models/workspace.model';

export const PRIVATE_WORKSPACES: Workspace[] = [
  {
    id: 'env',
    title: 'Climate & Environment',
    description: 'Learn about climate change and sustainability.',
    category: 'Environment',
    visibility: 'public',
    thumbnail: 'https://picsum.photos/seed/environment/400/240',
    createdAt: '2025-01-10',
  },
  {
    id: 'fashion',
    title: 'Sustainable Fashion',
    description: 'Ethical clothing and slow fashion ideas.',
    category: 'Fashion',
    visibility: 'public',
    thumbnail: 'https://picsum.photos/seed/fashion/400/240',
    createdAt: '2025-01-12',
  },
  {
    id: 'travel',
    title: 'Travel & Culture',
    description: 'Explore cultures and travel inspiration.',
    category: 'Travel',
    visibility: 'public',
    thumbnail: 'https://picsum.photos/seed/travel/400/240',
    createdAt: '2025-01-15',
  },
  {
    id: 'js',
    title: 'JavaScript Basics',
    description: 'Core JavaScript concepts for beginners.',
    category: 'Technology',
    visibility: 'public',
    thumbnail: 'https://picsum.photos/seed/javascript/400/240',
    createdAt: '2025-01-18',
  },
];
