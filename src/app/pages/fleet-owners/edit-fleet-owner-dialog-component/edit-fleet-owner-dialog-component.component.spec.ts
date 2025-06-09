import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFleetOwnerDialogComponentComponent } from './edit-fleet-owner-dialog-component.component';

describe('EditFleetOwnerDialogComponentComponent', () => {
  let component: EditFleetOwnerDialogComponentComponent;
  let fixture: ComponentFixture<EditFleetOwnerDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFleetOwnerDialogComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFleetOwnerDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
