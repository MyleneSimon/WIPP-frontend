import {Label} from './image-annotation';

export class ImageAnnotationsCollection {
  id: string;
  name: string;
  creationDate: Date;
  sourceJob: string;
  imagesCollectionId: string;
  startMaskCollectionId: string;
  owner: string;
  publiclyShared: boolean;
  taskId: string;
  labels: Label[];
  _links: any;
}

export interface PaginatedImageAnnotationsCollections {
  page: any;
  data: ImageAnnotationsCollection[];
  _links: any;
}
