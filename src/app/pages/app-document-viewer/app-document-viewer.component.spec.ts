import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDocumentViewerComponent } from './app-document-viewer.component';

describe('AppDocumentViewerComponent', () => {
  let component: AppDocumentViewerComponent;
  let fixture: ComponentFixture<AppDocumentViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDocumentViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDocumentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
