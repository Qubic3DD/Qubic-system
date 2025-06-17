import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverComponentFleet } from './driver.component';

describe('DriverComponentFleet', () => {
  let component: DriverComponentFleet;
  let fixture: ComponentFixture<DriverComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
