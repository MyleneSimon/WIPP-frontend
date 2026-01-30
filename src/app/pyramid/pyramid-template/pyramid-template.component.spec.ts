import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PyramidTemplateComponent } from './pyramid-template.component';

describe('PyramidTemplateComponent', () => {
  let component: PyramidTemplateComponent;
  let fixture: ComponentFixture<PyramidTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [PyramidTemplateComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PyramidTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
