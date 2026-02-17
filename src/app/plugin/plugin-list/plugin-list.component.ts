import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Plugin} from '../plugin';
import {PluginService} from '../plugin.service';
import {SelectionModel} from '@angular/cdk/collections';
import {PluginNewComponent} from '../plugin-new/plugin-new.component';
import {KeycloakService} from '../../services/keycloak/keycloak.service';
import {DialogService} from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { NgIf, DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-plugin-list',
    templateUrl: './plugin-list.component.html',
    styleUrls: ['./plugin-list.component.css'],
    providers: [DialogService, MessageService],
    imports: [TableModule, PrimeTemplate, NgIf, Button, InputTextModule, RouterLink, ToastModule, IconFieldModule, 
      InputIconModule, DatePipe]
})
export class PluginListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [ 'name', 'version', 'description'];
  plugins: Plugin[];
  selection = new SelectionModel<Plugin>(false, []);

  resultsLength = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  constructor(
    private pluginService: PluginService,
    private keycloakService: KeycloakService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit() {
  }

  loadData(event) {
    const sortOrderStr = event?.sortOrder == -1 ? 'desc' : 'asc';
    const sortField = event?.sortField ? event.sortField + ',' + sortOrderStr : 'creationDate,desc';
    const pageIndex = event ? event.first / event.rows : 0;
    const pageSize = event ? event.rows : this.pageSize;
    const params = {
      pageIndex: pageIndex,
      size: pageSize,
      sort: sortField
    };
    if(event.filters?.global?.value) {
      this.pluginService.getPluginsByNameContainingIgnoreCase(params, event.filters.global.value).subscribe(result => {
        this.plugins = result.plugins;
        this.resultsLength = result.page.totalElements;
      });
    } else {
      this.pluginService.getPlugins(params).subscribe(result => {
        this.plugins = result.plugins;
        this.resultsLength = result.page.totalElements;
      });
    }
  }

  displayNewPluginModal() {
    this.dialogService.open(PluginNewComponent, {
      header: 'New plugin',
      position: 'top',
      width: '50vw',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  canCreate(): boolean {
    return (this.keycloakService.hasRole('admin') || this.keycloakService.hasRole('developer'));
  }

  ngOnDestroy() {
    this.dialogService.dialogComponentRefMap.forEach((dialog) => dialog.destroy());
  }

}
