import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetDriverProfileComponent } from './view-fleet-owner.component';

describe('FleetDriverProfileComponent', () => {
  let component: FleetDriverProfileComponent;
  let fixture: ComponentFixture<FleetDriverProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetDriverProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetDriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
