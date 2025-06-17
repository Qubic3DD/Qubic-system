import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponentDriver } from './dashboard.component';

describe('DashboardComponentDriver', () => {
  let component: DashboardComponentDriver;
  let fixture: ComponentFixture<DashboardComponentDriver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponentDriver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponentDriver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
