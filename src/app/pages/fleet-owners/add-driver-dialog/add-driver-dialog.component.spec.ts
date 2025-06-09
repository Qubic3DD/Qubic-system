import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverDialogComponent } from './add-driver-dialog.component';

describe('AddDriverDialogComponent', () => {
  let component: AddDriverDialogComponent;
  let fixture: ComponentFixture<AddDriverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDriverDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
