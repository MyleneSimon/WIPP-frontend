import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidVisualizationHelpComponent } from './pyramid-visualization-help.component';

describe('PyramidVisualizationHelpComponent', () => {
  let component: PyramidVisualizationHelpComponent;
  let fixture: ComponentFixture<PyramidVisualizationHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PyramidVisualizationHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidVisualizationHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
