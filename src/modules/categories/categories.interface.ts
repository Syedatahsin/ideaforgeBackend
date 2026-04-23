export interface ICreateCategory {
  name: string;
  slug: string;
  description?: string;
}

export interface IUpdateCategory {
  name?: string;
  slug?: string;
  description?: string;
}

export interface ICategoryResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
