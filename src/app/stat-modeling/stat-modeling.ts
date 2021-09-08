export class StatModeling {
  id: string;
  name: string;
  creationDate: Date;
  manifest: any;
  owner: string;
  publiclyShared: boolean;
  _links: any;
}

export interface PaginatedStatModeling {
  page: any;
  data: StatModeling[];
  _links: any;
}
