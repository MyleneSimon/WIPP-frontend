import {AfterViewInit, Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import {KeycloakService} from '../services/keycloak/keycloak.service';

@Directive({
  selector: 'wippWsmt'
})
export class WsmtDirective implements AfterViewInit, OnChanges {

  @Input() public manifest: any;
  private w: any;

  constructor(private elem: ElementRef,
              private keycloakService: KeycloakService) {
  }

  ngAfterViewInit() {
    const id = this.elem.nativeElement.id = this.elem.nativeElement.id || WSMT.guid();
    let ajaxHeaders = {};
    if (this.keycloakService.isLoggedIn()) {
      ajaxHeaders = {
        Authorization: `Bearer ${this.keycloakService.getKeycloakAuth().token}`
      };
    }
    this.w = WSMT({
      id: id,
      imagesPrefix: 'assets/wsmt/images/',
      OpenSeadragon: {
        crossOriginPolicy: 'Anonymous',
        loadTilesWithAjax: true,
        ajaxHeaders: ajaxHeaders
      },
      autoAdjustHeight: true
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.manifest) {
      if (!this.manifest) {
        return;
      }
      try {
        this.manifest = typeof this.manifest === 'string'
          ? JSON.parse(this.manifest) : this.manifest;
        this.w.open(this.manifest);
      } catch (er) {
        // The manifest is probably just a URL, let WSMT deal with it.
      }
    }
  }

}
