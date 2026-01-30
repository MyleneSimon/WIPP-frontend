import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionTemplateComponent } from './images-collection-template.component';

describe('ImagesCollectionTemplateComponent', () => {
  let component: ImagesCollectionTemplateComponent;
  let fixture: ComponentFixture<ImagesCollectionTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ImagesCollectionTemplateComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
