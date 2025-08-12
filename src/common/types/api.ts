export type Params = {
  [key: string]: any;
  search?: string;
  page?: string | number;
  sort?: string;
  limit?: string;
  order?: string;
  fields?: string;
};

type MetaData = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export interface IResponse<T> {
  data: T;
  message: string;
  success: boolean;
  meta: MetaData;
}