import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IterativeTrainingPipelineRoutingModule} from './iterative-training-pipeline-routing.module';
import {IterativeTrainingPipelineListComponent} from './iterative-training-pipeline-list/iterative-training-pipeline-list.component';
import {IterativeTrainingPipelineDetailComponent} from './iterative-training-pipeline-detail/iterative-training-pipeline-detail.component';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FieldsetModule} from 'primeng/fieldset';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import {MessageModule} from 'primeng/message';
import {SkeletonModule} from 'primeng/skeleton';
import {IterativeTrainingPipelineNewComponent} from './iterative-training-pipeline-new/iterative-training-pipeline-new.component';
import {FormsModule} from '@angular/forms';
import {ChipModule} from 'primeng/chip';
import {ColorPickerModule} from 'primeng/colorpicker';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {InputGroupModule} from 'primeng/inputgroup';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {SelectModule} from 'primeng/select';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IterativeTrainingPipelineRoutingModule,
        TableModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        FieldsetModule,
        TooltipModule,
        DialogModule,
        MessageModule,
        SkeletonModule,
        ChipModule,
        ColorPickerModule,
        InputNumberModule,
        InputGroupAddonModule,
        InputGroupModule,
        AutoCompleteModule,
        SelectModule,
        IterativeTrainingPipelineListComponent,
        IterativeTrainingPipelineDetailComponent,
        IterativeTrainingPipelineNewComponent
    ]
})
export class IterativeTrainingPipelineModule { }
