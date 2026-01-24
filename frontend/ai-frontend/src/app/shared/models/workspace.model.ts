export interface Workspace {
  id: string;
  title: string;
  description: string;
  category: string;
  visibility: 'public' | 'private';
  thumbnail: string;
  createdAt: string;
}