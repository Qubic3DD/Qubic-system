import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFleetOwnerComponent } from './add-fleet-owner.component';

describe('AddFleetOwnerComponent', () => {
  let component: AddFleetOwnerComponent;
  let fixture: ComponentFixture<AddFleetOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFleetOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFleetOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
