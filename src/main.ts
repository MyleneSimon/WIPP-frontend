import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset, palette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

import { environment } from './environments/environment';
import { KeycloakService } from './app/services/keycloak/keycloak.service';
import { AppConfigService } from './app/app-config.service';
import { appInitializerFactory } from './app/app-init-factory';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { KeycloakInterceptorService } from './app/services/keycloak/keycloak.interceptor.service';
import { ConfirmDialogService } from './app/confirm-dialog/confirm-dialog.service';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AppRouteReuseStrategy } from './app/app-route-reuse-strategy';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { HomeModule } from './app/home/home.module';
import { ImagesCollectionModule } from './app/images-collection/images-collection.module';
import { StitchingVectorModule } from './app/stitching-vector/stitching-vector.module';
import { PyramidModule } from './app/pyramid/pyramid.module';
import { PyramidVisualizationModule } from './app/pyramid-visualization/pyramid-visualization.module';
import { AiModelModule } from './app/ai-model/ai-model.module';
import { CsvCollectionModule } from './app/csv-collection/csv-collection.module';
import { NotebookModule } from './app/notebook/notebook.module';
import { GenericDataModule } from './app/generic-data/generic-data.module';
import { PluginModule } from './app/plugin/plugin.module';
import { WorkflowModule } from './app/workflow/workflow.module';
import { ConfirmDialogModule } from './app/confirm-dialog/confirm-dialog.module';
import { ImageAnnotationsModule } from './app/image-annotations/image-annotations.module';
import { IterativeTrainingPipelineModule } from './app/iterative-training-pipeline/iterative-training-pipeline.module';
import { AppRoutingModule } from './app/app-routing.module';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AutoFocusModule } from 'primeng/autofocus';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: palette('{blue}')
    }
});

// We bootstrap the App with KeycloakService, to make sure KeycloakService is initialized
KeycloakService.init()
.then(() => bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(RouterModule, HomeModule, ImagesCollectionModule, StitchingVectorModule, PyramidModule, PyramidVisualizationModule, AiModelModule, CsvCollectionModule, NotebookModule, GenericDataModule, PluginModule, WorkflowModule, ConfirmDialogModule, ImageAnnotationsModule, IterativeTrainingPipelineModule, AppRoutingModule, FormsModule, MenuModule, MenubarModule, AutoFocusModule),
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            multi: true,
            deps: [AppConfigService]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: KeycloakInterceptorService,
            multi: true
        },
        KeycloakService,
        ConfirmDialogService,
        { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimationsAsync(),
        providePrimeNG({ 
            theme: {
                preset: MyPreset
            }
        })
    ]
}))
.catch(err => console.log(err));
