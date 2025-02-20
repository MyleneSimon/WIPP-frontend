import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IterativeTrainingPipelineListComponent} from './iterative-training-pipeline-list/iterative-training-pipeline-list.component';
import {IterativeTrainingPipelineDetailComponent} from './iterative-training-pipeline-detail/iterative-training-pipeline-detail.component';

const iterativeTrainingPipelinesRoute: Routes = [
  { path: 'iterative-training-pipelines', component: IterativeTrainingPipelineListComponent },
  { path: 'iterative-training-pipelines/:id', component: IterativeTrainingPipelineDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(iterativeTrainingPipelinesRoute)
  ],
  exports: [
    RouterModule
  ]
})

export class IterativeTrainingPipelineRoutingModule {}
