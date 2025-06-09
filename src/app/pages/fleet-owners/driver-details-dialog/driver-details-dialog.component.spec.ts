import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDetailsDialogComponent } from './driver-details-dialog.component';

describe('DriverDetailsDialogComponent', () => {
  let component: DriverDetailsDialogComponent;
  let fixture: ComponentFixture<DriverDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
