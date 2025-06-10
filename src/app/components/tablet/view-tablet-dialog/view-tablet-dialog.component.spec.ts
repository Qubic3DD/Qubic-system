import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTabletDialogComponent } from './view-tablet-dialog.component';

describe('ViewTabletDialogComponent', () => {
  let component: ViewTabletDialogComponent;
  let fixture: ComponentFixture<ViewTabletDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTabletDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTabletDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
