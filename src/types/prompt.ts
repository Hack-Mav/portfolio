export type PromptCategory = 'coding' | 'writing';

export interface PromptTemplate {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  template: string;
  variables?: {
    name: string;
    description: string;
    defaultValue?: string;
  }[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PromptPreview {
  rendered: string;
  variables: Record<string, string>;
}
