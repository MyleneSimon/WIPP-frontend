import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StatModeling} from '../stat-modeling';

@Component({
  selector: 'app-stat-modeling-new',
  templateUrl: './stat-modeling-new.component.html',
  styleUrls: ['./stat-modeling-new.component.css']
})
export class StatModelingNewComponent implements OnInit {

  @Input() modalReference: any;
  statModeling: StatModeling = new StatModeling();
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  cancel() {
    this.modalReference.dismiss();
  }
  save() {
    this.modalReference.close(this.statModeling);
  }


}
