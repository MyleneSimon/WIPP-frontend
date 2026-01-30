import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDataListComponent } from './generic-data-list.component';

describe('GenericDataListComponent', () => {
  let component: GenericDataListComponent;
  let fixture: ComponentFixture<GenericDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [GenericDataListComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
