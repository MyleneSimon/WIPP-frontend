import {ImageAnnotationsCollection} from '../image-annotations/image-annotations-collection';
import {Label} from '../image-annotations/image-annotation';

export class IterativeTrainingPipeline {
  id: string;
  name: string;
  creationDate: Date;
  trainingCollection: string;
  groundTruthCollection: string;
  startGroundTruthCollection: string;
  owner: string;
  publiclyShared: boolean;
  labels: Label[] = [];
  imagesPerIteration: number;
  taskCategory: TaskCategory;
  annotatedImages: string[] = [];
  iterations: TrainingIteration[];
  workflowTemplate: string;
  currentIteration: number;
  _links: any;
}

export interface PaginatedIterativeTrainingPipelines {
  page: any;
  data: IterativeTrainingPipeline[];
  _links: any;
}

export enum TaskCategory {
  SEGMENTATION,
  CLASSIFICATION
}

export interface TrainingIteration {
  iterationNumber: number;
  imageAnnotationsCollection: ImageAnnotationsCollection;
  trainingWorkflow: string;
  status: IterationStatus;
}

export enum IterationStatus {
  ANNOTATION,
  RUNNING,
  SUCCESSFUL,
  FAILED
}
