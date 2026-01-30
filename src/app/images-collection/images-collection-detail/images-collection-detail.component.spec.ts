import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesCollectionDetailComponent } from './images-collection-detail.component';

describe('ImagesCollectionDetailComponent', () => {
  let component: ImagesCollectionDetailComponent;
  let fixture: ComponentFixture<ImagesCollectionDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [ImagesCollectionDetailComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesCollectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
