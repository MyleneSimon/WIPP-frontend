import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookListComponent } from './notebook-list.component';

describe('NotebookListComponent', () => {
  let component: NotebookListComponent;
  let fixture: ComponentFixture<NotebookListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [NotebookListComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotebookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
