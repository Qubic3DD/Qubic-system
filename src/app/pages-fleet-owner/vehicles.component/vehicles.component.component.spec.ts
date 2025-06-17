import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclesComponentFleet } from './vehicles.component.component';

describe('VehiclesComponentFleet', () => {
  let component: VehiclesComponentFleet;
  let fixture: ComponentFixture<VehiclesComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclesComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclesComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
