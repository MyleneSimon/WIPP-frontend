import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {StatModeling} from '../stat-modeling';
import {ActivatedRoute, Router} from '@angular/router';
import {PyramidService} from '../../pyramid/pyramid.service';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {StatModelingService} from '../stat-modeling.service';
import {ModalErrorComponent} from '../../modal-error/modal-error.component';
import {forkJoin, Observable, of} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {DOCUMENT, Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {CsvCollectionService} from '../../csv-collection/csv-collection.service';

@Component({
  selector: 'app-stat-modeling-detail',
  templateUrl: './stat-modeling-detail.component.html',
  styleUrls: ['./stat-modeling-detail.component.css'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class StatModelingDetailComponent implements OnInit, OnDestroy {

  statModelingId = this.route.snapshot.paramMap.get('id');
  statModeling: StatModeling = new StatModeling();
  manifest: any = null;
  newGroup = {};
  layersGroups = [];
  showSettings = false;
  savedStatus = 'saved';
  @ViewChild('instance') instance: NgbTypeahead;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private locationStrategy: LocationStrategy,
    @Inject(DOCUMENT) private document,
    private modalService: NgbModal,
    private pyramidService: PyramidService,
    private csvCollectionService: CsvCollectionService,
    private statModelingService: StatModelingService,
    private keycloakService: KeycloakService
  ) {
  }

  ngOnInit() {
    this.statModelingService.getStatModeling(this.statModelingId)
      .subscribe(statModeling => {
        this.statModeling = statModeling;
        this.loadManifest();
      }, error => {
        this.router.navigate(['/404']);
      });
  }

  loadManifest() {
    if (!this.statModeling.manifest) {
      this.manifest = {
        'layersGroups': []
      };
      this.showSettings = true;
      return;
    }
    this.manifest = this.statModeling.manifest;
    const self = this;
    console.log('load');
    this.layersGroups = this.manifest.layersGroups.map(function (group) {
      return {
        label: group.id,
        layers: group.layers.map(function (layer) {
          const result = {
            label: layer.id,
            pyramid: {},
            csvCollection: {}
          };
          self.pyramidService.getPyramidFromBaseUrl(layer.baseUrl)
            .subscribe(function (pyramid) {
              result.pyramid = pyramid;
            });
          self.csvCollectionService.getCsvCollectionFromCsvBaseUrl(layer.colonyFeatures.serviceUrl)
            .subscribe(function (csvCollection) {
              result.csvCollection = csvCollection;
              console.log(csvCollection);
              console.log(self.layersGroups);
            });
          return result;
        }),
        newLayer: {}
      };
    });
  }

  updateManifest() {
    console.log('update');
    this.savedStatus = 'saving';
    this.getLayersGroups().subscribe(layersGroupsManifests => {
      this.manifest = {
        'layersGroups': layersGroupsManifests
      };
      console.log(this.statModeling);
      console.log(this.manifest);
      this.statModelingService.setStatModelingManifest(
        this.statModeling, this.manifest).subscribe(result => {
        this.savedStatus = 'saved';
      }, error => {
        this.savedStatus = 'error';
        const modalRefErr = this.modalService.open(ModalErrorComponent);
        modalRefErr.componentInstance.title = 'Cannot save configuration.';
        modalRefErr.componentInstance.message =
          'The configuration can not be saved on the server.<br>' +
          'Your recent modifications won\'t be available when you leave ' +
          'this page and come back later.';
      });
    }, error => {
      console.log('error layers group');
    });
  }

  getLayersGroups() {
    if (this.layersGroups.length === 0) {
      return of([]);
    } else {
      return forkJoin(this.layersGroups.map(layerGroup => {
        return this.getLayers(layerGroup).pipe(map(layersManifest => {
          return {
            id: layerGroup.label,
            name: layerGroup.label,
            layers: layersManifest
          };
        }));
      }));
    }
  }

  getLayers(layerGroup) {
    console.log(layerGroup);
    console.log(this.layersGroups);
    if (layerGroup.layers.length === 0) {
      return of([]);
    } else {
      return forkJoin(layerGroup.layers.map(layer => {
        return forkJoin(this.pyramidService.getPyramidManifest(layer.pyramid),
          this.csvCollectionService.getById(layer.csvCollection.id))
          .pipe(map(results => {
            const layerManifest = results[0]['layersGroups'][0].layers[0];
            layerManifest.id = layer.label;
            layerManifest.name = layer.label;
            layerManifest.viewUrl = this.document.location.origin +
              this.location.prepareExternalUrl(this.router.createUrlTree(['/pyramids', layer.pyramid.id]).toString());
            layerManifest.colonyFeatures = {
              serviceUrl: layer.csvCollection._links.self.href + '/csv',
              framesPrefix: 'merged',
              framesSuffix: '.csv',
              paddingSize: '0',
              layer: layerManifest.id
            };
            return layerManifest;
          }));
      }));
    }
  }

  addGroup() {
    this.layersGroups.push({
      label: this.newGroup['label'],
      layers: [],
      newLayer: {}
    });
    this.newGroup = {};
    this.updateManifest();
  }

  addLayer(group) {
    group.layers.push({
      label: group.newLayer.label,
      pyramid: group.newLayer.pyramid,
      csvCollection: group.newLayer.csvCollection
      // ppm: group.newLayer.ppm,
      // acquiredIntensity: group.newLayer.acquiredIntensity
    });
    group.newLayer = {};
    this.updateManifest();
  }

  isNewLayerValid(group) {
    if (!group.newLayer) {
      return false;
    }
    const label = group.newLayer.label;
    if (!label) {
      return false;
    }

    const pyramid = group.newLayer.pyramid;
    if (!pyramid || !pyramid.id) {
      return false;
    }

    const csvCollection = group.newLayer.csvCollection;
    if (!csvCollection || !csvCollection.id) {
      return false;
    }

    const duplicateLabel = this.getAllLayers().some(function (layer) {
      return layer.label === label;
    });
    if (duplicateLabel) {
      return false;
    }

    return true;
  }

  getAllLayers() {
    // flatMap
    return [].concat.apply([], this.layersGroups.map(function (group) {
      return group.layers;
    }));
  }

  isNewGroupValid() {
    if (!this.newGroup) {
      return false;
    }

    const label = this.newGroup['label'];
    if (!label) {
      return false;
    }

    const duplicateGroup = this.layersGroups.some(function (group) {
      return group.label === label;
    });
    if (duplicateGroup) {
      return false;
    }

    return true;
  }

  removeGroup(group) {
    const self = this;
    function doRemoveGroup() {
      const index = self.layersGroups.indexOf(group);
      if (index !== -1) {
        self.layersGroups.splice(index, 1);
        self.updateManifest();
      }
    }

    doRemoveGroup();
    // TODO: add confirmation dialogs
  }

  removeLayer(group, layer) {
    const index = group.layers.indexOf(layer);
    if (index !== -1) {
      group.layers.splice(index, 1);
      this.updateManifest();
    }
  }

  pyramidSelected(group) {
    const newLayer = group.newLayer;
    const pyramid = newLayer.pyramid;
  }

  csvCollectionSelected(group) {
    const newLayer = group.newLayer;
    const csvCollection = newLayer.csvCollection;
  }

  showHelp() {
    // const modalRef = this.modalService.open(PyramidVisualizationHelpComponent, { size: 'lg', backdrop: 'static', keyboard: true });
    // modalRef.componentInstance.modalReference = modalRef;
  }

  // Typeahead functions for pyramid and CSV collection search
  filterPyramid(term) {
    return this.pyramidService.getByNameContainingIgnoreCase(null, term).pipe(map(paginatedResult => {
      return paginatedResult.data;
    }));
  }
  filterCSVCollection(term) {
    return this.csvCollectionService.getByNameContainingIgnoreCase(null, term).pipe(map(paginatedResult => {
      return paginatedResult.data;
    }));
  }
  searchPyramid = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term => this.filterPyramid(term))
  )
  searchCsvCollection = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap(term => this.filterCSVCollection(term))
  )
  formatter = (x: {name: string}) => x.name;

  ngOnDestroy() {
    this.modalService.dismissAll();
  }


  makeStatModelingPublic(): void {
    this.statModelingService.makePublicStatModeling(
      this.statModeling).subscribe(statModeling => {
      this.statModeling = statModeling;
    });
  }

  canEdit(): boolean {
    return this.keycloakService.canEdit(this.statModeling);
  }
}
