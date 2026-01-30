import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContentComponent } from './dynamic-content.component';

describe('DynamicContentComponent', () => {
  let component: DynamicContentComponent;
  let fixture: ComponentFixture<DynamicContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [DynamicContentComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
