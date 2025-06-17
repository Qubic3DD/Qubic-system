import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDistributionComponent } from './vehicle-distribution.component';

describe('VehicleDistributionComponent', () => {
  let component: VehicleDistributionComponent;
  let fixture: ComponentFixture<VehicleDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
