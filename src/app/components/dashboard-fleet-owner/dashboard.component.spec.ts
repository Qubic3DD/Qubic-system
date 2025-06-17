import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponentFleet } from './dashboard.component';

describe('DashboardComponentFleet', () => {
  let component: DashboardComponentFleet;
  let fixture: ComponentFixture<DashboardComponentFleet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponentFleet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponentFleet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
