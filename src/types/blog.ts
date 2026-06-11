export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: string;
  readTime?: number;
}

export interface BlogApiResponse {
  data: Blog[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BlogFilters {
  search?: string;
  tag?: string;
  dateFrom?: string;
  dateTo?: string;
}
